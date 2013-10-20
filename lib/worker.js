var extend = require("./extend");
var Core = require("./core");

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
