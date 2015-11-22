var express = require('express');

var app = module.exports = express.Router();

app.get('/api/test', function(req, res) {
  res.status(200).send("hello nodejs...");
});
