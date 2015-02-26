var path = require('path');
var fs = require('fs');
var querystring = require('querystring');
var archive = require('../helpers/archive-helpers');

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};


exports.serveAssets = function(res, asset, callback) {

  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...), css, or anything that doesn't change often.)
};

exports.indexResponse = function(req, res, indexString){
  var filePath = "./web/public" + req.url;
  console.log(filePath);
  if (filePath == './web/public/')
    filePath = './web/public/' + indexString;

  var extname = path.extname(filePath);
  var contentType = 'text/html';
  switch (extname) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
  }

  fs.exists(filePath, function(exists) {

    if (exists) {
      fs.readFile(filePath, function(error, content) {
        if (error) {
          res.writeHead(500);
          res.end();
        }
        else {
          res.writeHead(200, { 'Content-Type': contentType });
          res.end(content, 'utf-8');
        }
      });
    }
    else {
      res.writeHead(404);
      res.end();
    }
  });

};


exports.sendResponse = function(res, data, statusCode){
  statusCode = statusCode || 200;
  res.writeHead(statusCode, headers);
  //This might need to be modified
  res.end(data);
};


exports.collectData = function(req,res, callback){
  console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
  //console.log("this is the request body", req);
  var newData = ''
  req.on('data', function(chunk){
    newData += chunk;
  });
  req.on('end', function(){
    console.log("this is the new data", querystring.parse(newData).url);
    var data = req;
    callback(req, res, "loading.html");
  });

};


// As you progress, keep thinking about what helper functions you can put here!
