var util = require('util')
var Core = require('../lib/core')

function Network (server, client) {
  this.initialize(server, client)
  this.server.on('Network.enable', this.enable.bind(this))
  this.server.on('Network.setCacheDisabled', this.setCacheDisabled.bind(this))
}

util.inherits(Network, Core)

Network.prototype.enable = function (req) {
  req.reply(true)
}

Network.prototype.setCacheDisabled = function (req) {
  req.reply(false)
}

module.exports = Network
