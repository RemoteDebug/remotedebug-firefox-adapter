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
        var node = this.domIndex[request.data.pageId][nodeId ];

        var page = this.client.getPage(request.data.pageId);

        page.DOM.highlightNode(node.geckoNode.rawNode, function() {
            console.log('DONE');
        });

    },

    _buildPageDomIndex: function(pageId, documentNode) {
        this.domIndex[pageId] = this._buildDomIndex(pageId, documentNode);
        console.log('_buildPageDomIndex', this.domIndex[pageId].length);
    },

    _buildDomIndex: function(pageId, node, array, offset) {

        var i = offset ? offset : 1;
        var index = array ? array : {};

        node.nodeId = i;
        index[i] = node;

        if(node.children.length) {
            node.children.forEach(function(subNode, subNodeIndex) {
                this._buildDomIndex(pageId, subNode, index, i + subNodeIndex + 1);
            }.bind(this));
        }

        return index;
    }


});

module.exports = DOM;
