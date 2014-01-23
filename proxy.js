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

        logger.info('remotedebug.start');

        var whenReady = Q.all([this.server.start(), this.client.connect()]);

        whenReady.then(function() {
            logger.info('remotedebug.ready');
            logger.info('-> visit http://localhost:' + this.options.server.port + '/json/');
        }.bind(this));

        whenReady.fail(function() {
            logger.error('remotedebug.error');
        }.bind(this));


    }

};

module.exports = RemoteDebugProxy;
