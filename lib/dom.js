var extend = require("./extend");
var Core = require("./core");
var DomNode = require("./dom.node");

function DOM(server, client) {
    this.initialize(server, client);

    this.server.on("DOM.getDocument", this.getDocument.bind(this));
    this.server.on("DOM.highlightNode", this.highlightNode.bind(this));

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

        node.geckoNode.highlight(function() {
            console.log('DONE');
        });

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
