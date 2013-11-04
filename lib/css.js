var extend = require('./extend');
var Core = require('./core');

function CSS(server, client, domNodeCache) {
    this.initialize(server, client);
    this.domNodeCache = domNodeCache;

    this.server.on('CSS.enable', this.enable.bind(this));
    this.server.on('CSS.getComputedStyleForNode', this.getComputedStyleForNode.bind(this));
}

CSS.prototype = extend(Core, {

    enable: function(request) {
        request.reply(true);
    },

    getComputedStyleForNode: function(request) {
        var node = this.domNodeCache.getNode(request.data.pageId, request.data.params.nodeId);
        var page = this.client.getPage(request.data.pageId);

        page.Styles.getComputed(node.geckoNode.actor, {}, function(err, properties) {

            request.reply({
                computedStyle: this._formatProperties(properties)
            });

        }.bind(this));
    },


    _formatProperties: function(properties) {

        var map = [];

        for(var key in properties) {

            if (properties.hasOwnProperty(key)) {
                map.push({
                    name: key,
                    value: properties[key].value
                });
            }

        }

        return map;
    }

});

module.exports = CSS;
