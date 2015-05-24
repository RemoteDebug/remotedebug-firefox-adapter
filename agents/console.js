var util = require('util')
var Core = require('../lib/core')

function Console (server, client) {
  this.initialize(server, client)
  this.server.on('Console.enable', this.enable.bind(this))
}

util.inherits(Console, Core)

Console.prototype.enable = function (req) {
  req.reply(true)
}

module.exports = Console
