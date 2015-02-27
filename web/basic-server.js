var http = require("http");
var handler = require("./request-handler");
var initialize = require("./initialize.js");
var urlParser = require('url');
var request = require('http-request');
var httpHelper = require('./http-helpers');

// Why do you think we have this here?
// HINT:It has to do with what's in .gitignore
initialize();

var port = 8080;
var ip = "127.0.0.1";
var routes = {
  "/": handler.handleRequest,
  "/styles.css": handler.handleRequest,
  "/loading.html": handler.handleRequest
};
var server = http.createServer(function(req, res){
  var parts = urlParser.parse(req.url);
  var route = routes[parts.pathname];
  if (route){
    route(req, res, parts.pathname);
  }
  else{
    //will add error response that will take res, "not found", 404
    httpHelper.sendResponse(res, null, 404);
  }
});
console.log("Listening on http://" + ip + ":" + port);
server.listen(port, ip);
