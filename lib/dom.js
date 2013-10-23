var extend = require("./extend");
var Core = require("./core");
var DomNode = require("./dom.node");

function DOM(server, client) {
    this.initialize(server, client);

    this.server.on("DOM.getDocument", this.getDocument.bind(this));
    this.server.on("DOM.highlightNode", this.highlightNode.bind(this));
    this.server.on("DOM.hideHighlight", this.hideHighlight.bind(this));
    this.server.on("DOM.setAttributesAsText", this.setAttributesAsText.bind(this));

    this.domIndex = {};
}

DOM.prototype = extend(Core, {

    getDocument: function(request) {

        var page = this.client.getPage(request.data.pageId);

        page.DOM.document(function(err, elmDocument) {

            var node = new DomNode(elmDocument);
            node.build().then(function() {

                this._buildPageDomIndex(request.data.pageId, node);

                var res = {
                    root: node.toJSON()
                };

                request.reply(res);

            }.bind(this));

        }.bind(this));
    },

    highlightNode: function(request) {
        var nodeId = request.data.params.nodeId;
        var node = this.domIndex[request.data.pageId][nodeId];

        node.geckoNode.highlight(function(){});
    },

    hideHighlight: function(request) {
        var page = this.client.getPage(request.data.pageId);
        page.DOM.document(function(err, elmDocument) {
            elmDocument.unhighlight(function(){});
        });
    },

    setAttributesAsText: function(request) {
        var nodeId = request.data.params.nodeId;
        var node = this.domIndex[request.data.pageId][nodeId];
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

        this.log('setAttributesAsText', request);
    },

    _buildPageDomIndex: function(pageId, documentNode) {
        this.domIndex[pageId] = this._buildDomIndex(pageId, documentNode);
    },

    _buildDomIndex: function(pageId, node, array) {

        var index = array ? array : {};

        index[node.nodeId] = node;

        if(node.children.length) {
            node.children.forEach(function(subNode) {
                this._buildDomIndex(pageId, subNode, index);
            }.bind(this));
        }

        return index;
    }


});

module.exports = DOM;
