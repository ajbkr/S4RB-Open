const csvjson = require('csvjson')
const express = require('express')
const fs = require('fs')
const path = require('path')

const router = express.Router()

router.get('/complaints/csv', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../data/complaints.csv'))
})

router.get('/complaints/json', (req, res) => {
  const data = fs.readFileSync(path.resolve(__dirname, '../../data/complaints.csv'), { encoding: 'utf8' })
  const options = {
    delimiter: ',',
    quote: '"'
  }

  res.json(csvjson.toObject(data, options))
})

module.exports = router
