var express = require('express');
var requestHandlers = require('./requestHandlers');
var redis = require('redis');

var redisClient = redis.createClient();
redisClient.on("error", function (err) {
	console.log("Error " + err);
});

var app = express();
app.get('/callfb', requestHandlers.callFacebook);
app.get('/', requestHandlers.getAUser);

app.get('/status', requestHandlers.status);

app.del('/facebook/users/', requestHandlers.deleteAllUsers);
app.del('/facebook/user/:id', requestHandlers.deleteUser);

// setup subscribe on redis channel to recreate users
var facebook = require('./facebookFunctions');
redisClient.on("message", function (channel, message) {
	console.log(message);
	facebook.createNewUser();
});
redisClient.subscribe("user_requested");

app.listen(1337);