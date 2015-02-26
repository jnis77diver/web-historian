var path = require('path');
var fs = require('fs');
var querystring = require('querystring');
var archive = require('../helpers/archive-helpers');
var http = require('http-request');
var Sequelize = require('sequelize');
var sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'sqlite',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },

  storage: 'database.sqlite'
});
//CREATE TABLE IN DATABASE FOR HTML DATA
var HTML = sequelize.define('html', {
  url: {
    type: Sequelize.STRING
  },
  html: {
    type: Sequelize.STRING
  }
});
//CREATE TABLE IN DATABASE FOR CSS DATA
var CSS = sequelize.define('css', {
  url: {
    type: Sequelize.STRING
  },
  css: {
    type: Sequelize.STRING
  }
});
//CREATE TABLE IN DATABASE FOR JS DATA
var JS = sequelize.define('js', {
  url: {
    type: Sequelize.STRING
  },
  js: {
    type: Sequelize.STRING
  }
});
//CODE BELOW FORCES CREATION OF DATABASE
//HTML.sync({force: true}).then(function() {
//  return HTML.create({
//    url: 'http://www.testdata.com',
//    html: "<html></html>"
//  })
//});
//CSS.sync({force: true}).then(function() {
//  return CSS.create({
//    url: 'http://www.testdata.com/styles.css',
//    css: ".body { color: red }"
//  })
//});
//JS.sync({force: true}).then(function() {
//  return JS.create({
//    url: 'http://www.testdata.com/script.js',
//    js: "var data = true;"
//  })
//});

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
    //query database for URL, if exists return index.html of url
    HTML.find({where: {url: fullURL}}).then(function(html) {
      if( html ) {
        console.log('return html',html.html);
        exports.sendResponse(res, html.html, 201);
      }
      //else, archive URL and return loading page
      else{
        http.get(fullURL, function (err, res) {
          if (err) {
            console.error(err);
            return;
          }
          var site = res.buffer.toString();
          HTML.sync().then(function() {
            return HTML.create({
              url: fullURL,
              html: site
            })
          });
          console.log("site ", site);
        });
        callback(req, res, "loading.html");
      }
    });


  });

};


// As you progress, keep thinking about what helper functions you can put here!
