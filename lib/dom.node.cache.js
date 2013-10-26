var extend = require("./extend");
var Core = require("./core");

function DOMNodeCache(server, client) {
    this.domIndex = {};
}

DOMNodeCache.prototype = extend(Core, {

    getNode: function(pageId, nodeId) {
        return this.domIndex[pageId][nodeId];
    },

    buildPageDomIndex: function(pageId, documentNode) {
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
    },

});

module.exports = DOMNodeCache;
