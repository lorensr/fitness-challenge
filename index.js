const express = require('express')
var bodyParser = require('body-parser')
const server = express()
const MongoClient = require('mongodb').MongoClient

const DEV_MONGO_URL = 'mongodb://localhost:27017'

const mongoUrl = process.env.MONGO_URL || DEV_MONGO_URL

console.log('Connecting to: ', mongoUrl)

let activities

MongoClient.connect(mongoUrl, (err, client) => {
  console.log(err, client)
  activities = client.db('challenge').collection('activites')
})

server.use(bodyParser.json())

server.get('/', (req, res) => res.send('Hello hi!'))

server.post('/slack', (req, res) => {
  const message = req.body.event.text
  activities.insertOne({
    activity: message
  })

  res.send(req.body.challenge)
})

server.listen(3000, () => console.log('Example server listening on port 3000!'))
