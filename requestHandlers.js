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
function deleteAllUsers(request, response) {
	// push users into used
	// get all used
	// hit facebook to delete them all. with retries.
}

function deleteUser(request, response) {
	facebook.deleteUser(request.params.id);
	// hit facebook
	// https://graph.facebook.com/TEST_USER_ID?method=delete&access_token=TEST_USER_ACCESS_TOKEN (OR) APP_ACCESS_TOKEN
	// if good response, delete from users list
	//client.lrem("users", 0, "some:key");
	// else, retry
	response.json(202, {"status": "Deleting "+request.params.id})
}

exports.getAUser = getAUser;
exports.callFacebook = callFacebook;
exports.deleteUser = deleteUser;