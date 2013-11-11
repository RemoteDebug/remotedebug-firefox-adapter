var Q = require("q");

function Node(geckoNode) {
    this.geckoNode = geckoNode;

    this.nodeId = 0;
    this.nodeName = geckoNode.nodeName;
    this.localName = geckoNode.localName || '';
    this.nodeType = geckoNode.nodeType;
    this.nodeValue = geckoNode.nodeValue || '';
    this.xmlVersion = geckoNode.xmlVersion || '';
    this.childNodeCount = geckoNode.numChildren || 0;
    this.children = [];
    this.documentURL = 'http://kenneth.io';
    this.baseURL = 'http://kenneth.io';
    this.attributes = [];

    this._updateNodeId();
}

Node.prototype = {

    build: function() {
        this._mapAttributes();
        return this._getChildren();
    },

    toJSON: function() {
        return {
            nodeId: this.nodeId,
            nodeName: this.nodeName,
            localName: this.localName,
            nodeType: this.nodeType,
            nodeValue: this.nodeValue,
            xmlVersion: this.xmlVersion,
            childNodeCount: this.childNodeCount,
            children : this.children.map(function(item) {
                return item.toJSON();
            }),
            documentURL: this.documentURL,
            baseURL: this.baseURL,
            attributes: this.attributes
        };
    },

    _mapAttributes: function() {

        if (!this.geckoNode.attrs) {
            return;
        }

        this.attributes = this.geckoNode.attrs.reduce(function(pre, cur, index) {
            return pre.concat([cur.name, cur.value]);
        }, []);
    },

    _getChildren: function() {
        var dfd = Q.defer();

        this.geckoNode.children(function(err, nodes) {

            var childDfd = [];
            var mapped = nodes.map(function(node) {
                var n = new Node(node);
                childDfd.push(n.build(node));
                return n;
            });

            Q.allSettled(childDfd).then(function() {
                this.children = mapped;
                this.childNodeCount = this.children.length;

                console.log('this.children', this.children);

                dfd.resolve(mapped);
            }.bind(this));


        }.bind(this));

        return dfd.promise;
    },

    _updateNodeId: function() {
        var extractedId = this.geckoNode.actor.match(/conn(.*).domnode(.*)/)[2];
        this.nodeId = parseInt(extractedId, 10);
    }

};

module.exports = Node;
