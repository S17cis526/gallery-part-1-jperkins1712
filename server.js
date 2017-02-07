"use strict"

/**
 * server.js
 * This file defines the server for a
 * simple photo gallery web app.
 */

//http object using node object
var http = require('http');

var url = require('url');

// filesystem object using node library
var fs = require('fs');

var port = 1712;  // nonstandard port
var config = JSON.parse(fs.readFileSync('config.json') || defaultConfig);

var stylesheet = fs.readFileSync('gallery.css');
var imageNames = ['ace.jpg', 'bubble.jpg', 'chess.jpg', 'fern.jpg', 'mobile.jpg'];

// returns an array of the image names in /images
function getImageNames(callback) {
  fs.readdir('images/', function(err, fileNames) {
    if (err) callback(err, null);
    else callback(false, fileNames);
  });
}

// takes in a file name and returns the file tag as a string
function imageNamesToTags(fileNames) {
  return fileNames.map(function(fileName) {
    return `<img src="${fileName}" alt="${fileName}">`;
  });
}

// reads an image and returns it
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

function buildGallery(imageTags) {
  var html = "<!doctype html>";
    html += '<head>';
    html +=   '<title>'+ config.title + '</title>';
    html +=   '<link href="gallery.css" rel="stylesheet" type="text/css">';
    html += '</head>';
    html += '<body>';
    html += ' <h1>'+ config.title +'</h1>';
    html += '  <form>';
    html += '   <input type="text" name="title">';
    html += '   <input type="submit" value="Change Gallery Title">';
    html += ' </form>';
    html += imageNamesToTags(imageTags).join('');
    html += '<form action="" method="POST" enctype="multipart/form-data">';
    html += ' <input type="file" name="image">';
    html += ' <input type="submit" Value="Upload Image">';
    html += '</body>';
  return html;
}

function serveGallery(req, res) {
  getImageNames(function(err, imageNames) {
    if (err) {
      console.err(err);
      res.statusCode = 500;
      res.statusMessage = 'Server Error';
      res.end();
    }

    res.setHeader('Content-Type', 'text/html');
    res.end(buildGallery(imageNames));

  });

}

function uploadPicture(req, res) {
  var body='';
  req.on('error', function() {
    res.statusCode = 500;
    res.statusMessage = "Error uploading image.";
    res.end();
  });
  req.on('data', function() {
    body += data;
  });
  req.on('end', function() {
    fs.writeFile('filename', body, function(err) {
      if (err) {
        console.error(err);
        res.statusCode = 500;
        res.statusMessage = "Error while uploading."
        res.end();
        return;
      }

      serveGallery(req, res);
    });
  });

}

// creates server but its not listening yet
var server = http.createServer(function(req, res) {

  // splits the url into two parts -- a resource and a queryString split by ?

  var urlParts = url.parse(req.url);

  if (urlParts.query) {
    var matches = /title=(.+)($|&)/.exec(urlParts.query);
    if (matches && matches[1]) {
      config.title = decodeURIComponent(matches[1]);
      fs.writeFile('config.json', JSON.stringify(config));
    }
    //looking for any number of chars (.) repeated any number of times (+) ended by end of string (^&)
  }

  switch (urlParts.pathname) {
    case '/':
    case '/gallery':
      if (req.method == 'GET') {
      serveGallery(req, res); }
      else if (req.method == 'POST') {
        uploadPicture(req, res); // consumes POST request, generates response
      }
      break;
    case '/gallery.css':
      res.setHeader('Content-Type', 'text/css');
      res.end(stylesheet);
      break;
    default:
      serveImage(req.url, req, res);

  }


});

// server listens to the port that we gave it
server.listen(port, function(){
  console.log("Ayee we here up in port " + port + " and we listenin bruh");
});
