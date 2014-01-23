var EventEmitter = require('events').EventEmitter,
    Q = require('q'),
    FirefoxClient = require("firefox-client"),
    extend = require('node.extend'),
    logger = require('./logger');

function Client(options) {

    this.options = options;
    this.client = new FirefoxClient();
    this.client.on('error', function(error) {
        this.emit('error', error);
    });

    this.info = {
        runtime: 'firefox',
        tabs: []
    };

    this.tabs = [];

}

Client.prototype = extend({}, {

    connect: function() {

        var dfd = new Q.defer();

        logger.info('client.connecting');

        this.client.connect(this.options.client.port, function() {

            logger.info('client.connected: port ' + this.options.client.port);
            this.getTabs();
            dfd.resolve();

        }.bind(this));

        this.client.on('err', function(err) {
            logger.error('client.error', err);
            dfd.reject();
        }.bind(this));

        return dfd.promise;
    },

    getTabs: function() {

        var dfd = new Q.defer();

        this.client.listTabs(function(err, tabs) {
            this.tabs = tabs;
            dfd.resolve(this.tabs);
        }.bind(this));

        return dfd.promise;
    },

    getInfo: function() {

        var dfd = new Q.defer();

        this.getTabs().then(function(tabs) {
            var data  = extend(this.info, this._formatTabs(tabs));
            dfd.resolve(data);
        }.bind(this));

        return dfd.promise;
    },

    getPage: function(id) {

        var matchedTabs = this.tabs.filter(function(tab) {
            return tab.actor === id;
        });

        return matchedTabs[0];

    },

    _formatTabs: function(tabs) {

        return tabs.map(function(tab) {

            return {
                description: '',
                devtoolsFrontendUrl: '/devtools/devtools.html?ws=localhost:' + this.options.server.port + '/devtools/page/' + tab.tab.actor,
                devtoolsUrl: 'chrome-devtools://devtools/bundled/devtools.html?ws=localhost:' + this.options.server.port + '/devtools/page/' + tab.tab.actor,
                id: tab.tab.actor,
                title: tab.title,
                type: 'page',
                url: tab.url,
                webSocketDebuggerUrl: 'ws://localhost:' + this.options.server.port + '/devtools/page/' + tab.tab.actor
            };

        }.bind(this));

    }

});

module.exports = Client;
