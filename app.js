'use strict';

const PORT = process.env.PORT || 3340;
const transFilename = './transactions.json';

var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var fs = require('fs');
var http = require('http');
var path = require('path');
var uuid = require('uuid');

const totalFilename = path.join(__dirname, './total.json');

var app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', function(req, res) {
  var indexPath = path.join(__dirname, 'index.html');
  res.sendFile(indexPath);
});

app.get('/style.css', function(req, res, next){
  res.sendFile(path.join(__dirname, './style.css'));
});

app.get('/main.js', function(req, res, next){
  res.sendFile(path.join(__dirname, './main.js'));
});

app.get('/total', function(req, res, next){
  res.sendFile(totalFilename);
});

app.post('/total', function(req, res) {
  console.log(req.body);
  fs.writeFile(totalFilename, JSON.stringify(req.body), function(err) {
    console.error('totalPOST err: ', err);
    res.end();
    });
  })

app.get('/trans', function(req, res) {
  fs.readFile(transFilename, function(err, data) {
    var trans = JSON.parse(data);
    res.send(trans);
  });
});

app.post('/trans', function(req, res) {
  fs.readFile(transFilename, function(err, data) {
    var trans = JSON.parse(data);
    var newTrans = req.body;
    newTrans.id = uuid.v1();
    trans.push(newTrans);
  fs.writeFile(transFilename, JSON.stringify(trans), function(err) {
    console.error(err);
    res.end();
    });
  })
})

app.delete('/trans/:id', function (req, res) {
  var id = req.params.id;
  fs.readFile(transFilename, function(err, data) {
    var trans = JSON.parse(data);
    var transaction = trans.find(function(obj) {
      return obj.id === id;
    });
    console.log(transaction);
    trans.splice(transaction, 1);
    fs.writeFile(transFilename, JSON.stringify(trans), function(err) {
      console.error(err);
      res.end();
    });
  })
})

var server = http.createServer(app);

server.listen(PORT, function() {
console.log(`Server listening on port ${PORT}`);
})
