var express = require('express');
var app = express(),
	publicDir = require('path').join(__dirname);
app.use(express.static(publicDir));
// app.use('/', express.static('index.html'));
app.listen(8000);
console.log('server running on port:8000');
