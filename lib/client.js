var Q = require('q')
var FirefoxClient = require('firefox-client')
var logger = require('./logger')

function Client (options) {
  this.options = options
  this.tabs = []

  this.client = new FirefoxClient()
  this.client.on('error', function (error) {
    this.emit('error', error)
  })
}

Client.prototype.connect = function () {
  var dfd = new Q.defer()

  logger.info('client.connecting on ', this.options.client.port)

  this.client.connect(this.options.client.port, function () {
    logger.info('client.connected: port ' + this.options.client.port)
    this.getTabs()
    dfd.resolve()

  }.bind(this))

  this.client.on('err', function (err) {
    logger.error('client.error', err)
    dfd.reject()
  })

  return dfd.promise
}

Client.prototype.getTabs = function () {
  var dfd = new Q.defer()

  this.client.listTabs(function (err, tabs) {
    if (err) err.reject(err)
    this.tabs = tabs
    dfd.resolve(this.tabs)
  }.bind(this))

  return dfd.promise
}

Client.prototype.getPage = function (id) {
  var matchedTabs = this.tabs.filter(function (tab) {
    return tab.actor === id
  })

  return matchedTabs[0]
}

module.exports = Client
