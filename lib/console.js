var extend = require('./extend');
var Core = require('./core');

function Console(server, client) {
    this.initialize(server, client);
    this.server.on('Console.enable', this.enable.bind(this));
}

Console.prototype = extend(Core, {

    enable: function(request) {
        request.reply(true);
    }

});

module.exports = Console;
