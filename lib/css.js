var extend = require("./extend");
var Core = require("./core");

function CSS(server, client) {
  this.initialize(server, client);
  this.server.on("CSS.getMatchedStylesForNode", this.getMatchedStylesForNode.bind(this));
}

CSS.prototype = extend(Core, {

  getMatchedStylesForNode: function(request) {

    var params = request.params;

    console.log('getMatchedStylesForNode', request);
  }

});

module.exports = CSS;






