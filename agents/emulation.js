var util = require('util')
var Core = require('../lib/core')

function Emulation (server, client) {
  this.initialize(server, client)
  this.server.on('Emulation.canEmulate', this.canEmulate.bind(this))
}

util.inherits(Emulation, Core)

Emulation.prototype.canEmulate = function (req) {
  req.reply(false)
}

module.exports = Emulation
