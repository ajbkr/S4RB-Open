const csvjson = require('csvjson')
const express = require('express')
const fs = require('fs')
const path = require('path')

const router = express.Router()

router.get('/complaints/csv', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../data/complaints.csv'))
})

router.get('/complaints/json', (req, res) => {
  const data = fs.readFileSync(
    path.resolve(__dirname, '../../data/complaints.csv'),
    { encoding: 'utf8' }
  )
  const options = {
    delimiter: ',',
    quote: '"'
  }

  res.json(csvjson.toObject(data, options))
})

router.get('/cpmu/json', (req, res) => {
  const data = fs.readFileSync(
    path.resolve(__dirname, '../../data/complaints.csv'),
    { encoding: 'utf8' }
  )
  const options = {
    delimiter: ',',
    quote: '"'
  }

  const complaints = csvjson.toObject(data, options)
  const cpmu = complaints.map(
    ({ Complaints, Month, Quarter, UnitsSold }) => {
      const complaints = parseInt(Complaints)
      const unitsSold = parseInt(UnitsSold)

      const cpmu = (Number.isInteger(complaints) && Number.isInteger(unitsSold))
        ? complaints / unitsSold * 1000000 : 'No Value'  // XXX

      return {
        CPMU: cpmu,
        Month,
        Quarter
      }
    }
  )
  res.json(cpmu)
})

module.exports = router
