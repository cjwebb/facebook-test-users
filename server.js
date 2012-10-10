var express = require('express');
var requestHandlers = require('./requestHandlers');

var app = express();
app.get('/callfb', requestHandlers.callFacebook);
app.get('/', requestHandlers.getAUser);

app.del('/facebook/user/:id', requestHandlers.deleteUser);

app.listen(1337);