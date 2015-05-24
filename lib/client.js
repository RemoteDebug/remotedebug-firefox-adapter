var Promise = require('es6-promise').Promise
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
  return new Promise(function (resolve, reject) {
    logger.info('client.connecting on ', this.options.client.port)

    this.client.connect(this.options.client.port, function () {
      logger.info('client.connected: port ' + this.options.client.port)
      resolve()
    }.bind(this))

    this.client.on('err', function (err) {
      logger.error('client.error', err)
      reject(err)
    })
  }.bind(this))

}

Client.prototype.getTabs = function () {
  var that = this

  return new Promise(function (resolve, reject) {
    that.client.listTabs(function (err, tabs) {
      if (err) reject(err)
      that.tabs = tabs
      resolve(that.tabs)
    })
  })
}

Client.prototype.getPage = function (id) {
  var matchedTabs = this.tabs.filter(function (tab) {
    return tab.actor === id
  })

  return matchedTabs[0]
}

module.exports = Client
