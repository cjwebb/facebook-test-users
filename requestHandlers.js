var redis = require('redis');
var facebook = require('./facebookFunctions');

client = redis.createClient();
client.on("error", function (err) {
	console.log("Error " + err);
});

/**
 * Request Handlers
 */
function callFacebook(req, res) {
	facebook.createNewUser();
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