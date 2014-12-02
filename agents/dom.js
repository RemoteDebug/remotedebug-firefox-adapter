var Core = require("../lib/core");
var extend = require("../lib/extend");
var DomNode = require("../models/domNode");

function DOM(server, client, domNodeCache) {
    this.initialize(server, client);

    this.server.on("DOM.getDocument", this.getDocument.bind(this));
    this.server.on("DOM.highlightNode", this.highlightNode.bind(this));
    this.server.on("DOM.hideHighlight", this.hideHighlight.bind(this));
    this.server.on("DOM.setAttributesAsText", this.setAttributesAsText.bind(this));

    this.domNodeCache = domNodeCache;
}

DOM.prototype = extend(Core, {

    getDocument: function(request) {

        var page = this.client.getPage(request.data.pageId);

        page.DOM.document(function(err, elmDocument) {

            var node = new DomNode(elmDocument);
            node.build().then(function() {

                this.domNodeCache.buildPageDomIndex(request.data.pageId, node);

                var res = {
                    root: node.toJSON()
                };

                request.reply(res);

            }.bind(this));

        }.bind(this));
    },

    highlightNode: function(request) {
        var node = this.domNodeCache.getNode(request.data.pageId, request.data.params.nodeId);

        node.geckoNode.highlight(function(){});
    },

    hideHighlight: function(request) {
        var page = this.client.getPage(request.data.pageId);
        page.DOM.document(function(err, elmDocument) {
            elmDocument.unhighlight(function(){});
        });
    },

    setAttributesAsText: function(request) {
        var node = this.domNodeCache.getNode(request.data.pageId, request.data.params.nodeId);
        var text = request.data.params.text;

        // TODO: Improve parser - really optimistic
        text.split(' ').forEach(function(pair) {

            var set = pair.split('=');

            if(set.length !== 2) {
                return;
            }

            var name = set[0].trim().replace('"', '');
            var value = set[1].trim().replace('"', '');

            node.geckoNode.setAttribute(name, value, function() {});
        });
    }

});

module.exports = DOM;
