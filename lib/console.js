var extend = require("./extend");
var Core = require("./core");

function Console(server) {
  this.initialize(server);
  this.server.on("Page.enable", this.enable.bind(this));
}

Console.prototype = extend(Core, {

  enable: function(request) {
    request.reply(false);
  }

});

module.exports = Console;



