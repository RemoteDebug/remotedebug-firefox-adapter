var extend = require("./extend");
var Core = require("./core");

function Network(server, client) {
    this.initialize(server, client);
    this.server.on("Network.enable", this.enable.bind(this));
    this.server.on("Network.setCacheDisabled", this.setCacheDisabled.bind(this));
}

Network.prototype = extend(Core, {

    enable: function(request) {
        request.reply(false);
    },

    setCacheDisabled: function(request) {
        request.reply(false);
    },

});

module.exports = Network;
