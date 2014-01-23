var Q = require('q');

var Client = require('./lib/client');
var Server = require('./lib/server');
var logger = require('./lib/logger');
var DOMNodeCache = require('./lib/domNodeCache');

// Agents
var Info = require('./agents/info');
var Console = require('./agents/console');
var Runtime = require('./agents/runtime');
var Page = require('./agents/page');
var CSS = require('./agents/css');
var DOM = require('./agents/dom');
var Network = require('./agents/network');
var Worker = require('./agents/worker');

// Options
const defaultOptions = {
    client: {
        port: 6000
    },
    server: {
        port: 9222
    }

};


function RemoteDebugProxy(options) {

    logger.info('remotedebug.initialize');

    this.options = options || defaultOptions;

    this.server = new Server(this.options);
    this.client = new Client(this.options);

    var domNodeCache = new DOMNodeCache();

    // Areas
    new Worker(this.server, this.client);
    new Network(this.server, this.client);
    new DOM(this.server, this.client, domNodeCache);
    new CSS(this.server, this.client, domNodeCache);
    new Page(this.server, this.client);
    new Console(this.server, this.client);
    new Info(this.server, this.client);
    new Runtime(this.server, this.client);
}

RemoteDebugProxy.prototype = {

    start: function() {

        var whenClientConnected = this.client.connect();
        var whenServerStarted = this.server.start();
        logger.info('remotedebug.start');

        Q.allSettled([whenClientConnected, whenServerStarted]).then(function() {
            logger.info('RemoteDebug Firefox bridge is ready.');
            logger.debug('-> visit http://localhost:' + this.options.server.port + '/json/');
        }.bind(this));

    }

};

module.exports = RemoteDebugProxy;
