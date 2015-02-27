/**
 * Created by ppp on 2/26/2015.
 */
var path = require('path');
var fs = require('fs');
var httpRequest = require('http-request');
var helpers = require('../web/http-helpers');
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
//CODE BELOW FORCES CREATION OF DATABASE
//HTML.sync({force: true}).then(function() {
//  return HTML.create({
//    url: 'http://www.testdata.com',
//    html: "<html></html>"
//  })
//});

exports.databaseQuery = function(url, req, res, callback) {
  //query the html table for urls that were created today
  sequelize.query("SELECT html FROM htmls WHERE url = " + "'" + url + "'" + " AND date(createdAt) = date('now')", { type: sequelize.QueryTypes.SELECT}).then(function(html) {
      if (html[0] !== undefined) {
        helpers.sendResponse(res, html[0].html, 201);
      } else {
        console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
        console.log('it failed');
        console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
        exports.getExternalURLandInsert(url);
        //redirect to a page (in this case loading.html page)
        res.writeHead(303, {Location: 'loading.html'});
        res.end();
      }
  });
};

exports.getExternalURLandInsert = function(url) {
  httpRequest.get(url, function(err, res) {
    if (err) {
      console.error(err);
      return;
    }
    var site = res.buffer.toString();
    HTML.sync().then(function() {
      return HTML.create({
        url: url,
        html: site
      });
    });
  });
};




exports.databaseUpdate = function() {
  sequelize.query("SELECT DISTINCT url FROM htmls", { type: sequelize.QueryTypes.SELECT})
    .then(function(urls) {
      urls.forEach(function(url) {
        //call helpers.collectData
        exports.getExternalURLandInsert(url);
      })
    })
};

exports.databaseUpdate();