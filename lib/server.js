var Q = require('q')
var logger = require('./logger')
var Request = require('./request')
var HttpRequest = require('./httprequest')
var util = require('util')
var events = require('events')
var EventEmitter = require('events').EventEmitter
var WebSocketServer = require('ws').Server
var express = require('express')
var http = require('http')

function Server (options) {
  this.options = options
}

util.inherits(Server, events.EventEmitter);

Object.defineProperty(Server.prototype, 'port', {
  get: function get() {
    return this.options && this.options.server.port
  }
})

Server.prototype.start = function () {
  var dfd = new Q.defer()

  this._listenHttp()
  this._listenSocket()

  dfd.resolve()

  return dfd.promise
}

Server.prototype.send = function (data) {
  this.socket.send(JSON.stringify(data))
}

Server.prototype._listenHttp = function () {
  logger.info('server.http.listerning (port ' + this.options.server.port + ')')

  var app = express()

  app.get('/json', function (req, res) {
    var httprequest = new HttpRequest(res, 'Info.getInfo')
    this.emit('Info.getInfo', httprequest)
  }.bind(this))

  this.webserver = http.createServer(app).listen(this.options.server.port)

}

Server.prototype._listenSocket = function () {
  logger.info('server.socket.listerning (port ' + this.options.server.port + ')')

  this.socket = new WebSocketServer({
    server: this.webserver
  })

  this.socket.on('connection', function (connection) {
    var pageId = _extractPageId(connection.upgradeReq.url)

    logger.info('server.socket.client.connected.', pageId)

    connection.on('message', function (data) {
      var message = JSON.parse(data)
      message.pageId = pageId

      var req = new Request(connection, message)

      this.emit(message.method, req)
    }.bind(this))

  }.bind(this))
}

function _extractPageId(str) {
  return str.match(/\/devtools\/page\/(.*)/)[1]
}

module.exports = Server
