var redis = require('redis');
var http = require('http'); 

// setup redis
client = redis.createClient();
client.on("error", function (err) {
	console.log("Error " + err);
});

function callFacebook(request, response) {
	
}

function getAUser(request, response) {
	response.writeHead(200, {"Content-Type": "application/json"});
	client.rpoplpush("users", "used", function(err, reply){
		response.write(reply);
		response.end();
	});
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