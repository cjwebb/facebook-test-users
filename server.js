var express = require('express');
var requestHandlers = require('./requestHandlers');
var redis = require('redis');

var redisClient = redis.createClient();
redisClient.on("error", function (err) {
	console.log("Error " + err);
});

var redisClient2 = redis.createClient();
redisClient2.on("error", function (err) {
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
	facebook.createNewUser(function (user){
		redisClient2.hmset("user:"+newUser.id, "access_token", newUser.access_token);
		redisClient2.lpush("users", "user:"+newUser.id);
	});
});
redisClient.subscribe("user_requested");

// on startup, go and fetch some users
NUMBER_OF_USERS_TO_HAVE_AVAILABLE = 10; // TODO: config
redisClient2.llen("users", function(err, numberOfUsers) {
	console.log("Startup: "+numberOfUsers+" users currently available");
	var usersNeeded = NUMBER_OF_USERS_TO_HAVE_AVAILABLE - numberOfUsers;
	if (usersNeeded > 0) {
		console.log("Startup: Fetching "+usersNeeded+" users");
		for (i=0; i<usersNeeded; i++) {
			facebook.createNewUser(function(user){
				redisClient2.hmset("user:"+newUser.id, "access_token", newUser.access_token);
				redisClient2.lpush("users", "user:"+newUser.id);
			});
		}
	}
});

console.log("Startup: Listening on 127.0.01:1337");
app.listen(1337);