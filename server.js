var express = require('express');
var app = express(),
	publicDir = require('path').join(__dirname);
app.use(express.static(publicDir));
// app.use('/', express.static('index.html'));
app.listen(1337);
console.log('server running on port:1337');
