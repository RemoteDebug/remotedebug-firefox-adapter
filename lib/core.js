var events = require("events"),
    extend = require("node.extend"),
    Logger = require("./logger");

var Core = extend({}, Logger, events.EventEmitter.prototype, {

    initialize: function(server, client) {
        this.server = server;
        this.client = client;
    },

});

module.exports = Core;
