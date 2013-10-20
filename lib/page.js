var extend = require("./extend");
var Core = require("./core");

function Page(server, client) {
  this.initialize(server, client);
  this.server.on("Page.enable", this.enable.bind(this));
}

Page.prototype = extend(Core, {

  enable: function(request) {
    request.reply(false);
  }

});

module.exports = Page;



