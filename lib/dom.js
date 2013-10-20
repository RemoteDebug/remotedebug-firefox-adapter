var extend = require("./extend");
var Core = require("./core");
var DomNode = require("./dom.node");

function DOM(server, client) {
    this.initialize(server, client);

    this.server.on("DOM.getDocument", this.getDocument.bind(this));
    this.server.on("DOM.highlightNode", this.highlightNode.bind(this));
}

DOM.prototype = extend(Core, {

    getDocument: function(request) {

        var page = this.client.getPage(request.data.pageId);

        page.DOM.document(function(err, elmDocument) {
            var node = new DomNode(elmDocument);
            node.build(elmDocument).then(function() {

                var res = {
                    root: node
                };

                request.reply(res);

            });

        });
    },

    highlightNode: function(request) {
        console.log('highlightNode', request);

    }


});

module.exports = DOM;
