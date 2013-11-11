var Core = require("../lib/core");
var extend = require("../lib/extend");

function Worker(server, client) {
    this.initialize(server, client);
    this.server.on("Worker.canInspectWorkers", this.canInspectWorkers.bind(this));
}

Worker.prototype = extend(Core, {

    canInspectWorkers: function(request) {

        request.reply(false);
    }

});

module.exports = Worker;
