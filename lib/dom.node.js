var Q = require("q");

function Node(geckoNode) {
    this.nodeId = 1;
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
}

Node.prototype = {

    build: function(geckoNode) {
        this._mapAttributes(geckoNode);
        return this._getChildren(geckoNode);
    },

    _mapAttributes: function(geckoNode) {

        console.log('_mapAttributes', geckoNode.attrs);

        if (!geckoNode.attrs) {
            return;
        }

        console.log('attrs', geckoNode.attrs);

        this.attributes = geckoNode.attrs.reduce(function(pre, cur, index) {
            return pre.concat([cur.name, cur.value]);
        }, []);

    },

    _getChildren: function(geckoNode) {
        var dfd = Q.defer();

        geckoNode.children(function(err, nodes) {

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

    }

};

module.exports = Node;
