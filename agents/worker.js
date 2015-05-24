var util = require('util')
var Core = require('../lib/core')

function Worker (server, client) {
  this.initialize(server, client)
  this.server.on('Worker.canInspectWorkers', this.canInspectWorkers.bind(this))
}

util.inherits(Worker, Core)

Worker.prototype.canInspectWorkers = function (req) {
  req.reply(false)
}

module.exports = Worker
