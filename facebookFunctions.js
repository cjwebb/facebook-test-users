var redis = require('redis');
var rquest = require("request");
var config = require('./config');

client = redis.createClient();
client.on("error", function (err) {
	console.log("Error " + err);
});

/**
 * Functions to interact with Facebook 
 */
function createNewUser(callback) {
	var path = "https://graph.facebook.com/"+config.facebook.appId+"/accounts/test-users?installed=true&method=post";
	var facebook = path + "&access_token=" + config.facebook.appAccessToken;

	rquest(facebook, function (error, resp, body) {
		if (!error && resp.statusCode == 200) {
			newUser = JSON.parse(body);
			if (newUser.hasOwnProperty("id") && newUser.hasOwnProperty("access_token")) {
	    		console.log("Adding new user: "+newUser.id);
	    		console.log(newUser);
	    		
	    		// hooray, we have a user. stick in redis
	    		client.hmset("user:"+newUser.id, "access_token", newUser.access_token);
	    		client.lpush("users", "user:"+newUser.id);
	    		
	    		if (typeof callback !== 'undefined') callback(newUser);
			} else {
	    		console.log("Facebook returned error:")
	    		console.log(newUser);
			}
		} else {
			// if it has oauth, don't retry
			// else failure + retry
			if (error) {
				console.log(error);
			} else {
				console.log(resp.statusCode);
				console.log(body);
			}
			// some kind of retry? send failure to callback?
		}
	});
}

function deleteUser(id, callback) {
	console.log("Deleting User: "+id);
}

exports.createNewUser = createNewUser;
exports.deleteUser = deleteUser;