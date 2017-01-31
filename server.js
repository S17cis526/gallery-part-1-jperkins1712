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

var stylesheet = fs.readFileSync('gallery.css');
var imageNames = ['ace.jpg', 'bubble.jpg', 'chess.jpg', 'fern.jpg', 'mobile.jpg'];

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
    case '/gallery':
      // performs function on all fileNames -- makes array out of them -- joins them with a delimitor
      var gHtml = imageNames.map(function(fileName) {
        return ' <img src="' + fileName + '"alt="a fishing ace at work">';
      }).join('');
      var html = "<!doctype html>";
        html += '<head>';
        html +=   '<title>Gallery</title>';
        html +=   '<link href="gallery.css" rel="stylesheet" type="text/css">';
        html += '</head>';
        html += '<body>';
        html += ' <h1>Gallery</h1>';
        html += gHtml;
        html += '</body>';
      res.setHeader('Content-Type', 'text/html');
      res.end(html);
      break;
    case "/chess":
    case "/chess/":
    case "/chess.jpg":
      serveImage('chess.jpg', req, res);
      break;
    case "/ace":
    case "/ace/":
    case "/ace.jpg":
      serveImage('ace.jpg', req, res);
      break;
    case "/fern":
    case "/fern/":
    case "/fern.jpg":
      serveImage('fern.jpg', req, res);
      break;
    case '/gallery.css':
      res.setHeader('Content-Type', 'text/css');
      res.end(stylesheet);
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
