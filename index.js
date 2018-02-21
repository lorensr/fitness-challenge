const express = require('express')
var bodyParser = require('body-parser')
const server = express()
const MongoClient = require('mongodb').MongoClient

const DEV_MONGO_URL = 'mongodb://localhost:27017'

const mongoUrl = process.env.MONGO_URL || DEV_MONGO_URL

console.log('Connecting to MongoDB instance at: ', mongoUrl)

let activities

MongoClient.connect(mongoUrl, (err, client) => {
  if (err) {
    console.error(err)
    return
  }

  console.log('Successfully connected to MongoDB')
  activities = client.db('challenge').collection('activities')
})

server.use(bodyParser.json())

server.get('/', async (req, res) => {
  const docs = await activities.find({}).toArray()
  const allActivities = docs.map(doc => doc.activity).join('—')
  res.send(allActivities)
})

server.post('/slack', (req, res) => {
  const message = req.body.event.text
  activities.insertOne({
    activity: message
  })

  res.send(req.body.challenge)
})

server.listen(3000, () => console.log('Example server listening on port 3000!'))
