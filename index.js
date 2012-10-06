var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {}
handle["/"] = requestHandlers.getAUser;
handle["/callfb"] = requestHandlers.callFacebook;
handle["/populate"] = requestHandlers.populate;

server.start(router.route, handle);
// start worker thread too