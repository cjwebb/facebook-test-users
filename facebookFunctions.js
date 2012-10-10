/**
 * Functions to interact with Facebook 
 */
var redis = require('redis');
var rquest = require("request");
var config = require('./config');

fbClient = redis.createClient();
fbClient.on("error", function (err) {
	console.log("Error " + err);
});

// create a brand new test user
function createNewUser(callback) {
	var path = "https://graph.facebook.com/"+config.facebook.appId+"/accounts/test-users?installed=true&method=post";
	var facebook = path + "&access_token=" + config.facebook.appAccessToken;

	rquest(facebook, function (error, resp, body) {
		if (!error && resp.statusCode == 200) {
			newUser = JSON.parse(body);
			if (newUser.hasOwnProperty("id") && newUser.hasOwnProperty("access_token")) {
	    		console.log("Adding new user: "+newUser.id);
	    		console.log(newUser);	    		
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

// delete a test user, by id
function deleteUser(id, callback) {
	console.log("Deleting User: "+id);
	var deleteUser = "https://graph.facebook.com/"+id+"?method=delete"; 
	var deleteUser = deleteUser + "&access_token=" + config.facebook.appAccessToken;
	rquest(deleteUser, function(error, resp, body){
		console.log(error);
		console.log(body);
		
		// send error back if one happened
		callback();
	});
}

exports.createNewUser = createNewUser;
exports.deleteUser = deleteUser;