var express = require('express');
var requestHandlers = require('./requestHandlers');

var app = express();
app.get('/callfb', requestHandlers.callFacebook);
app.get('/', requestHandlers.getAUser);

app.listen(1337);