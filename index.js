const express = require('express')
var bodyParser = require('body-parser')
const server = express()
const MongoClient = require('mongodb').MongoClient

const DEV_MONGO_URL = 'mongodb://localhost:27017'

const mongoUrl = process.env.MONGO_URL || DEV_MONGO_URL

console.log('Connecting to: ', mongoUrl)

// MongoClient.connect(url, function(err, client) {
//   // Use the admin database for the operation
//   const adminDb = client.db(dbName).admin();
//   // List all the available databases
//   adminDb.listDatabases(function(err, dbs) {
//     test.equal(null, err);
//     test.ok(dbs.databases.length > 0);
//     client.close();
//   });
// });

server.use(bodyParser.json())

server.get('/', (req, res) => res.send('Hello hi!'))

server.post('/slack', (req, res) => {
  const message = req.body.event.text

  res.send(req.body.challenge)
})

server.listen(3000, () => console.log('Example server listening on port 3000!'))
