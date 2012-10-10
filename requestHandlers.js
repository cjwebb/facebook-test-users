var redis = require('redis');
var facebook = require('./facebookFunctions');

function redisError(err) {
	console.log("Error " + err);
}
// client used to retrieve things from redis
client = redis.createClient();
client.on("error", redisError);
// client2 used to put things into redis
client2 = redis.createClient();
client2.on("error", redisError);

/**
 * Request Handlers
 */
function status(request, response) {
	// TODO: retrieve the number of current facebook test users available
	// is there anything else we care about?
	// app secret, app id, access token?
	client.llen("users", function(err, numUsers) {
		response.json({"usersAvailable":numUsers});
	});
}

function callFacebook(request, response) {
	facebook.createNewUser(function(user) {
		client2.hmset("user:"+newUser.id, "access_token", newUser.access_token);
		client2.lpush("users", "user:"+newUser.id);
	});
	response.json(202, {"status": "Adding 1"});
}

function getAUser(request, response) {
	client.brpoplpush("users", "used", 60, function(error, user){
		if (!error && user !== null) {
			response.json(user);
			client.publish("user_requested", "1 user requested");
		} else {
			console.log(error);
			response.json(503, {"error": "no facebook test users available"});
		}
	});
}

function deleteAllUsers(request, response) {
	// push users into used
	// get all used
	// hit facebook to delete them all. with retries.
	response.json(202, {"status": "Deleting all users"});
}

function deleteUser(request, response) {
	id = request.params.id;
	facebook.deleteUser(id, function(error) {
		if (!error) { client.lrem("used", 0, "user:"+id); }
	});
	response.json(202, {"status": "Deleting "+request.params.id})
}

exports.status = status;
exports.getAUser = getAUser;
exports.callFacebook = callFacebook;
exports.deleteUser = deleteUser;
exports.deleteAllUsers = deleteAllUsers;