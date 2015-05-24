var util = require('util')
var Core = require('../lib/core')

function Animation (server, client) {
  this.initialize(server, client)
  this.server.on('Animation.getPlaybackRate', this.getPlaybackRate.bind(this))
}

util.inherits(Animation, Core)

Animation.prototype.getPlaybackRate = function (req) {
  req.reply({
    playbackRate: 1
  })
}

module.exports = Animation
