"use strict"

/**
 * server.js
 * This file defines the server for a
 * simple photo gallery web app.
 */

//http object using node object
var http = require('http');

// filesystem object using node library
var fs = require('fs');

var port = 1712;  // nonstandard port

function serveImage(filename, req, res) {
  var body = fs.readFile('images/' + filename, function(err, body) {
    if (err) {
      console.error();
      res.statusCode = 500;
      res.statusMessage = "Error while reading file";
      res.end("OOPS");
      return;
    }
    else {
      var img = fs.readFileSync('images/' + filename);
      res.setHeader("Content-Type", "image/jpeg");
      res.end(img);
    }
  });
}

// creates server but its not listening yet
var server = http.createServer(function(req, res) {
  switch (req.url) {
    case "/chess":
    case "/chess/":
      serveImage('chess.jpg', req, res);
      break;
    case "/ace":
    case "/ace/":
      serveImage('ace.jpg', req, res);
      break;
    case "/fern":
    case "/fern/":
      serveImage('fern.jpg', req, res);
      break;
    default:
      res.statusCode = 404;
      res.statusMessage = "Not Found";
      res.end();
  }


});

// server listens to the port that we gave it
server.listen(port, function(){
  console.log("Ayee we here up in port " + port + " and we listenin bruh");
});
