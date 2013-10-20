var Q = require('q');
var Logger = require('./logger');
var Request = require('./request');
var HttpRequest = require('./httprequest');
var extend = require('node.extend');
var EventEmitter = require('events').EventEmitter;
var WebSocketServer = require('ws').Server;
var express = require('express');
var http = require('http');

function Server(options) {

  this.options = options;

}

Server.prototype = extend({}, Logger, EventEmitter.prototype, {

  start: function() {

    var dfd = new Q.defer();

    this._listenHttp();
    this._listenSocket();

    dfd.resolve();

    return dfd.promise;

  },

  send: function(data) {
    console.log('SEND', data);
    this.socket.send(JSON.stringify(data));
  },

  _listenHttp: function() {
    this.log('server.http.listerning (port ' + this.options.server.port + ')');

    var app = express();

    app.get('/json', function(req, res) {
      var httprequest = new HttpRequest(res, 'Info.getInfo');
      this.emit('Info.getInfo', httprequest);
    }.bind(this));

    this.webserver = http.createServer(app).listen(this.options.server.port);

  },

  _listenSocket: function() {

    this.log('server.socket.listerning (port ' + this.options.server.port + ')');

    this.socket = new WebSocketServer({
      server: this.webserver
    });

    this.socket.on('connection', function(connection) {

      var pageId = this._extractPageId(connection.upgradeReq.url);

      this.log('server.socket.client.connected.', pageId);

      connection.on('message', function(data) {
        var message = JSON.parse(data);
        message.pageId = pageId;

        var req = new Request(connection, message);

        this.emit(message.method, req);
      }.bind(this));

    }.bind(this));

  },

  _extractPageId: function(str) {
    return str.match(/\/devtools\/page\/(.*)/)[1];
  }

});

module.exports = Server;
