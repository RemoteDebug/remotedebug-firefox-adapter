var events = require("events"),
    extend = require("node.extend");
    
var Core = extend({}, events.EventEmitter.prototype, {

    initialize: function(server, client) {
        this.server = server;
        this.client = client;
    },

});

module.exports = Core;
