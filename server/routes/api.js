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
    ({ Month: month, Complaints: complaints, UnitsSold: unitsSold }) => ({
      CPMU: (complaints / unitsSold * 1000000).toFixed(5),
      Month: new Date(month).toLocaleDateString('en-GB', {
        month: 'long',
        year: 'numeric'
      })
    })
  )
  res.json(cpmu)
})

module.exports = router
