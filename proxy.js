var Q = require('q');

var Client = require('./lib/client');
var Server = require('./lib/server');
var log = require('./lib/logger');

var Worker = require('./lib/worker');
var Network = require('./lib/network');
var DOM = require('./lib/dom');
var CSS = require('./lib/css');
var Page = require('./lib/page');
var Console = require('./lib/console');
var Info = require('./lib/info');


const defaultOptions = {
    client: {
        port: 6000
    },
    server: {
        port: 8080
    }

};

function RemoteDebugProxy(options) {

    this.options = options || defaultOptions;

    this.server = new Server(this.options);
    this.client = new Client(this.options);

    // Areas
    new Worker(this.server, this.client);
    new Network(this.server, this.client);
    new DOM(this.server, this.client);
    new Page(this.server, this.client);
    new Console(this.server, this.client);
    new Info(this.server, this.client);
    new CSS(this.server, this.client);


}

RemoteDebugProxy.prototype = {

    start: function() {

        var whenClientConnected = this.client.connect();
        var whenServerStarted = this.server.start();

        Q.allSettled([whenClientConnected, whenServerStarted]).then(function() {
            console.log('RemoteDebug proxy is ready.');
        });

    }

};

module.exports = RemoteDebugProxy;
