var extend = require('node.extend');
var Logger = require('./logger');

function HttpRequest(httpResponse, method) {
  this.httpResponse = httpResponse;
  this.method = method;

  this.log('httprequest.received:', this.method);
}

HttpRequest.prototype = extend({}, Logger, {

  reply: function(result) {
    this.log('httprequest.reply', result);
    this.httpResponse.send(result);

  }

});

module.exports = HttpRequest;
