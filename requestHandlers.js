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

function callFacebook(req, res) {
	var path = "https://graph.facebook.com/"+config.facebook.appId+"/accounts/test-users?installed=true&method=post";
	var facebook = path + "&access_token=" + config.facebook.appAccessToken;

	rquest(facebook, function (error, resp, body) {
		if (!error) {
	    	newUser = JSON.parse(body);
	    	if (newUser.hasOwnProperty("id") && newUser.hasOwnProperty("access_token")) {
	    		console.log("Adding new user: "+newUser.id);
	    		console.log(newUser);
	    		client2.hmset("user:"+newUser.id, "access_token", newUser.access_token);
	    		client2.lpush("users", "user:"+newUser.id);
	    	} else {
	    		console.log("Facebook returned error:")
	    		console.log(newUser)
	    	}
	    } else {
	        console.log(error);
	    }
	});
	res.json({"adding": 1});
}

function getAUser(req, res) {
	client.brpoplpush("users", "used", 60, function(error, user){
		if (!error && user !== null) {
			res.json(user);
		} else {
			console.log(error);
			res.json(503, {"error": "no facebook test users available"});
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

exports.getAUser = getAUser;
exports.callFacebook = callFacebook;