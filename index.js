var Q = require('q')
var Client = require('./lib/client')
var Server = require('./lib/server')
var logger = require('./lib/logger')
var DOMNodeCache = require('./lib/domNodeCache')

// Agents
var Animation = require('./agents/animation')
var Emulation = require('./agents/emulation')
var Info = require('./agents/info')
var Console = require('./agents/console')
var Runtime = require('./agents/runtime')
var Page = require('./agents/page')
var CSS = require('./agents/css')
var DOM = require('./agents/dom')
var Network = require('./agents/network')
var Worker = require('./agents/worker')

// Options
var defaultOptions = {
  client: {
    port: 6000
  },
  server: {
    port: 9223
  }
}

function Adaptor (options) {
  logger.info('adaptor.initialize')

  this.options = options || defaultOptions
  this.server = new Server(this.options)
  this.client = new Client(this.options)

  var domNodeCache = new DOMNodeCache()

  this.agents = [
    new Animation(this.server, this.client, domNodeCache),
    new Console(this.server, this.client, domNodeCache),
    new CSS(this.server, this.client, domNodeCache),
    new DOM(this.server, this.client, domNodeCache),
    new Emulation(this.server, this.client, domNodeCache),
    new Page(this.server, this.client, domNodeCache),
    new Info(this.server, this.client, domNodeCache),
    new Network(this.server, this.client, domNodeCache),
    new Runtime(this.server, this.client, domNodeCache),
    new Worker(this.server, this.client, domNodeCache)
  ]
}

Adaptor.prototype = {

  start: function () {
    logger.info('adaptor.start')

    var whenReady = Q.all([this.server.start(), this.client.connect()])

    whenReady
      .then(function () {
        logger.info('adaptor.ready')
        logger.info('-> visit http://localhost:' + this.options.server.port + '/json/')
      }.bind(this))
      .catch(function () {
        logger.error('adaptor.error')
      })
  }

}

module.exports = Adaptor
