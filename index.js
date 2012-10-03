var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {}
handle["/"] = requestHandlers.getAUser;
handle["/populate"] = requestHandlers.populate;

server.start(router.route, handle);