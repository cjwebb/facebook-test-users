var redis = require('redis');
var rquest = require("request");
var config = require('./config');

client = redis.createClient();
client.on("error", function (err) {
	console.log("Error " + err);
});

client2 = redis.createClient();
client2.on("error", function (err) {
	console.log("Error " + err);
});


function callFacebook(request, response) {
	var path = "https://graph.facebook.com/"+config.facebook.appId+"/accounts/test-users?installed=true&method=post";
	var facebook = path + "&access_token=" + config.facebook.appAccessToken;

	rquest(facebook, function (error, resp, body) {
	    if (!error) {
	    	newUser = JSON.parse(body);
	    	console.log(newUser);
	        client2.hmset("user:"+newUser.id, "access_token", newUser.access_token);
	        client2.lpush("users", "user:"+newUser.id);
	    } else {
	        console.log(error);
	    }
	});
	
	response.writeHead(200, {"Content-Type": "application/json"});
    response.write(JSON.stringify({"adding": 1}));
    response.end();
}

function getAUser(request, response) {
	client.brpoplpush("users", "used", 60, function(error, reply){
		if (!error) {
			response.writeHead(200, {"Content-Type": "application/json"});
			response.write(reply);
			response.end();
			// send a redis publish command
		} else {
			console.log(error);
		}
	});
}

// TODO:
function deleteAllUsers(request, response) {}

// TODO:
function deleteUser(request, response) {
	// https://graph.facebook.com/TEST_USER_ID?method=delete&access_token=TEST_USER_ACCESS_TOKEN (OR) APP_ACCESS_TOKEN
	// delete from users list
	client.lrem("users", 0, "some:key");
}

/* fetch a facebook test user, and put it in redis */
function populate(request, response) {

    response.writeHead(200, {"Content-Type": "text/html"});

	// need to get a facebook user instead of bob
	client.lpush("users", "user:bob");
	client.hmset("user:bob", "access_token", "an-access-token");

	response.write("Added Bob");
	response.end();
}

exports.getAUser = getAUser;
exports.populate = populate;
exports.callFacebook = callFacebook;