var util = require('util')
var events = require('events')

var Core = function () {

}

util.inherits(Core, events.EventEmitter);

Core.prototype.initialize = function (server, client) {
  this.server = server
  this.client = client
}

module.exports = Core
