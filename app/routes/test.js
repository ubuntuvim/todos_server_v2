var express = require('express');

var app = module.exports = express.Router();

app.get('/api/test', function(req, res) {
	console.log('request url /api/test.....');
    res.status(200).send("hello nodejs...");
});
