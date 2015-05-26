var util = require('util')
var Core = require('../lib/core')

function Inspector (server, client) {
  this.initialize(server, client)
  this.server.on('Inspector.enable', this.enable.bind(this))
}

util.inherits(Inspector, Core)

Inspector.prototype.enable = function (req) {
  req.reply(true)
}

module.exports = Inspector
