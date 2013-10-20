var extend = require("./extend");
var Core = require("./core");

function Info(server, client) {
  this.initialize(server, client);
  this.server.on("Info.getInfo", this.getInfo.bind(this));
}

Info.prototype = extend(Core, {

  getInfo: function(request) {

    this.client.getInfo().then(function(data) {
      request.reply(data);
    });

  }

});

module.exports = Info;



