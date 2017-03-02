/** @module router */

module.exports = Router;

var url = require('url');

function Router() {
  // underscore begs developers to treat these as private variables
  this._getRoutes = [];
  this._postRoutes = [];
}

function pathToRegularExpression(path) {
  var tokens = path.split('/');
  var keys = [];
  var parts = tokens.map(function(token) {
    if(token.charAt(0) === ":") {
      keys.push(token.slic(1));
      return "(\\w+)";
    } else {
      return token;
    }
  });
  var regexp = new RexExp('^' + parts.join('/') + '/?$');
  return {
    regexp: regexp,
    keys: keys
  };
}

Router.prototype.get = function(path, handler) {
  this._getRoutes.push(); // path..
  this._getAction.push(handler);
}

Router.prototype.post = function(path, handler) {
  this._postRoutes[path] = handler;
}

Router.prototype.route = function(req, res) {
  var urlParts = url.parse(req.url);
  switch(req.method) {
    case 'get':
      for (var i = 0; i<this._getRoutes.length; i++) {
        var match = this._getRoutes[i].exec(urlParts.pathname);
        if (match) {
          return this._getAction[i](req, res); // function at key path that takes req, res
        }
      }
      res.statusCode = 404;
      res.statusMessage = "Resource not found";
      res.end();
      break;
    case 'post:':
      for(var i=0; i<this._postRoutes.length; i++){
        var match = this._postRoutes[i].exec(urlParts.pathname);
        if (match) {
          return this._postRoutes[i](req, res);
        }
      }
      res.statusCode = 404;
      res.statusMessage = "Resource not found";
      res.end();
      break;
    default:
      var message = "Unknown method " + req.method;
      res.statusCode = 400;
      res.statusMessage = message;
      res.end(message);
  }
}
