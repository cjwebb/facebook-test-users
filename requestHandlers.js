var redis = require('redis'); 

// setup redis
client = redis.createClient();
client.on("error", function (err) {
	console.log("Error " + err);
});

function getAUser(request, response) {
    response.writeHead(200, {"Content-Type": "application/json"});
	
	response.write(JSON.stringify({
		"user":1,
		"access_token": "some-access-token"
	}));
	
	response.end();
}

/* fetch a facebook test user, and put it in redis */
function populate(request, response) {
    response.writeHead(200, {"Content-Type": "text/html"});

	client.sadd("users", "user:bob");
	client.hmset("user:bob", "access_token", "an-access-token");

	response.write("Added Bob");
	response.end();
}

exports.getAUser = getAUser;
exports.populate = populate;