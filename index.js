const express = require('express')
const bodyParser = require('body-parser')
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
  // const docs = await activities.find({}).toArray()
  // const allActivities = docs.map(doc => doc.activity)
  // let miles = 0
  // const milesByActivity = {}
  // console.log(allActivities)
  // res.send(allActivities)
})

const STEPS_PER_MILE = 2347

const parseMessage = message => {
  const [
    _,
    distanceString,
    unit,
    activityType,
    day
  ] = /([^ ]+) (miles|steps) (.+) on day (.+)/.exec(message)

  const distance = parseFloat(distanceString.replace(/,/g, ''))

  return {
    miles: unit === 'steps' ? distance / STEPS_PER_MILE : distance,
    activityType,
    day: parseInt(day)
  }
}

server.post('/slack', (req, res) => {
  const message = req.body.event.text
  const data = parseMessage(message)

  activities.insertOne({
    activity: message,
    ...data
  })

  res.send(req.body.challenge)
})

server.listen(3000, () => console.log('Example server listening on port 3000!'))
