var Core = require("../lib/core");
var extend = require("../lib/extend");

function Network(server, client) {
    this.initialize(server, client);
    this.server.on("Network.enable", this.enable.bind(this));
    this.server.on("Network.setCacheDisabled", this.setCacheDisabled.bind(this));
}

Network.prototype = extend(Core, {

    enable: function(request) {
        request.reply(true);
    },

    setCacheDisabled: function(request) {
        request.reply(false);
    },

});

module.exports = Network;
