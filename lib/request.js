var logger = require('./logger')

function Request (connection, data) {
  this.connection = connection
  this.data = data

  logger.info('request.received:', this.data.id, this.data.method)
}

Request.prototype.reply = function (result) {
  var reply = JSON.stringify({
    id: this.data.id,
    result: result
  })

  logger.info('request.reply', reply)
  this.connection.send(reply)
}

Request.prototype.send = function (data) {
  logger.info('request.send', data)
  this.connection.send(JSON.stringify(data))
}

Request.prototype.sendNotification = function (method, params) {
  var msg = {
    method: method,
    params: params
  }

  this.send(msg)
}

module.exports = Request
