var path = require('path');
var fs = require('fs');
var querystring = require('querystring');
var archive = require('../helpers/archive-helper-improved');
var http = require('http-request');

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

/**
 * This provides the initial html to the client.
 * @param req
 * @param res
 * @param {String} indexString
 */
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
  var newData = '';
  req.on('data', function(chunk){
    newData += chunk;
  });
  req.on('end', function(){
    var fullURL = querystring.parse(newData).url;
    var check = /http:\/\/[\w\W]+/;
    if( !check.exec(fullURL) ) {
      fullURL = "http://" + fullURL;
    }
    //query database for URL, if exists return index.html of
    archive.databaseQuery(fullURL, req, res, callback);
    //archive.databaseUpdate();
  });

};


// As you progress, keep thinking about what helper functions you can put here!
