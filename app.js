const express = require('express');
const cors = require("cors");
const mongo = require('mongodb')
const app = express();

const port = process.env.PORT || 5000;

const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://127.0.0.1:27017';
var db;

app.use(cors())

MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, (err, client) => {
    
  if (err) {
    return console.log(err);
  }

  db = client.db('testdb');
  console.log(`MongoDB Connected: ${url}`);
});

app.use(express.urlencoded({extended: true}));
app.use(express.json())

app.get('/getnotes', (req, res) => {

  const notes = db.collection('notes');

  notes.find().toArray((err, results) => {
    res.send(results)
  });
})

app.post('/addnote', (req, res) => {

  db.collection('notes').insertOne({name: req.body.noteText, age: 100}, function(err, res) {
    if (err) throw err;
  });

  res.sendStatus(200);
})

app.post('/editnote', (req, res) => {

  var myquery = { _id: new mongo.ObjectId(req.body.id) };
  var newvalues = { $set: {name: req.body.note } };

  db.collection("notes").updateOne(myquery, newvalues, function(err, res) {
    if (err) throw err;
  });

  res.sendStatus(200);
})

app.post('/deletenote', (req, res) => {

  db.collection('notes').deleteOne( {"_id": new mongo.ObjectId(Object.keys(req.body)[0])}, function(err,  res){
    if (err) throw err;
  });

  res.sendStatus(200);
})

app.listen(port, (err) => {
  if (err) return console.log(err);
  console.log('Server running on port: ', port);
})