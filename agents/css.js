var Core = require("../lib/core");
var extend = require("../lib/extend");

var CSSRule = require('../models/cssRule');
var CSSComputedStyleProperty = require('../models/cssComputedStyleProperty');

function CSS(server, client, domNodeCache) {
    this.initialize(server, client);
    this.domNodeCache = domNodeCache;

    this.server.on('CSS.enable', this.enable.bind(this));
    this.server.on('CSS.getComputedStyleForNode', this.getComputedStyleForNode.bind(this));
    this.server.on('CSS.getMatchedStylesForNode', this.getMatchedStylesForNode.bind(this));
    this.server.on('CSS.getAllStyleSheets', this.getAllStyleSheets.bind(this));
    this.server.on('CSS.getSupportedCSSProperties', this.getSupportedCSSProperties.bind(this));
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

    getMatchedStylesForNode: function(request) {
        var node = this.domNodeCache.getNode(request.data.pageId, request.data.params.nodeId);
        var page = this.client.getPage(request.data.pageId);

        page.Styles.getApplied(node.geckoNode.actor, { matchedSelectors : true }, function(err, data) {

            var response = {
                matchedCSSRules: data.rules.map(function(rule) {
                    return {
                        rule: new CSSRule(rule),
                        matchingSelectors: []
                    };
                }.bind(this)),
                pseudoElements: [],
                inherited: []
            };

            request.reply(response);

        }.bind(this));
    },

    getSupportedCSSProperties: function(request) {

        request.reply({
            cssProperties: []
        });

    },

    getAllStyleSheets: function(request) {

        var page = this.client.getPage(request.data.pageId);

        page.StyleSheets.getStyleSheets(function(err, stylesheets) {

            var data = stylesheets.map(function(stylesheet) {

                return {
                    stylesheetId: stylesheet.sheet.styleSheetIndex,
                    origin: 'regular',
                    disabled: stylesheet.sheet.disabled,
                    sourceURL: stylesheet.sheet.href,
                    title: stylesheet.sheet.title,
                    frameId: 1,
                    isInline: false,
                    startLine: 0,
                    startColumn: 0
                };

            }.bind(this));

            request.reply({
                headers: [data]
            });


        }.bind(this));

    },



    _formatProperties: function(properties) {

        var map = [];

        for (var key in properties) {
            if (properties.hasOwnProperty(key)) {
                map.push(new CSSComputedStyleProperty(key, properties[key].value));
            }
        }

        return map;
    }

});

module.exports = CSS;
