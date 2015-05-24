var util = require('util')
var Core = require('../lib/core')

var CSSRule = require('../objects/CSSRule')
var CSSComputedStyleProperty = require('../objects/CSSComputedStyleProperty')
var CSSStylesheet = require('../objects/cssStylesheet')

function CSS (server, client, domNodeCache) {
  this.initialize(server, client)
  this.domNodeCache = domNodeCache

  this.server.on('CSS.enable', this.enable.bind(this))
  this.server.on('CSS.getComputedStyleForNode', this.getComputedStyleForNode.bind(this))
  this.server.on('CSS.getMatchedStylesForNode', this.getMatchedStylesForNode.bind(this))
  this.server.on('CSS.getInlineStylesForNode', this.getInlineStylesForNode.bind(this))
  this.server.on('CSS.getAllStyleSheets', this.getAllStyleSheets.bind(this))
  this.server.on('CSS.setPropertyText', this.setPropertyText.bind(this))
}

util.inherits(CSS, Core)

CSS.prototype.enable = function (request) {
  request.reply(true)
}

CSS.prototype.getInlineStylesForNode = function (request) {
  var node = this.domNodeCache.getNode(request.data.pageId, request.data.params.nodeId)
  if (!node) return
}

CSS.prototype.getComputedStyleForNode = function (request) {
  var node = this.domNodeCache.getNode(request.data.pageId, request.data.params.nodeId)
  if (!node) return

  var page = this.client.getPage(request.data.pageId)
  page.Styles.getComputed(node.geckoNode.actor, {}, function (err, properties) {
    if (err) throw new Error(err)

    request.reply({
      computedStyle: this._formatProperties(properties)
    })
  }.bind(this))
}

CSS.prototype.getMatchedStylesForNode = function (request) {
  var node = this.domNodeCache.getNode(request.data.pageId, request.data.params.nodeId)
  if (!node) return

  var page = this.client.getPage(request.data.pageId)
  page.Styles.getApplied(node.geckoNode.actor, {
    matchedSelectors: true
  }, function (err, data) {
    if (err) throw new Error(err)


    data.rules = data.rules.filter(function (rule) {
      return rule.type !== 100
    })

    var response = {
      matchedCSSRules: data.rules.map(function (rule) {
        return {
          rule: new CSSRule(rule),
          matchingSelectors: [0]
        }
      }),
      pseudoElements: [],
      inherited: []
    }

    request.reply(response)

  })
}

CSS.prototype.getAllStyleSheets = function (request) {
  var page = this.client.getPage(request.data.pageId)

  page.StyleSheets.getStyleSheets(function (err, stylesheets) {
    if (err) throw new Error(err)

    var data = stylesheets.map(function (stylesheet) {
      var ss = new CSSStylesheet(stylesheet.sheet.styleSheetIndex)
      ss.disabled = stylesheet.sheet.disabled
      ss.sourceURL = stylesheet.sheet.sourceURL
      ss.title = stylesheet.sheet.title

      return ss
    })

    request.reply({
      headers: [data]
    })

  })
}

CSS.prototype.setPropertyText = function (req) {

}

CSS.prototype._formatProperties = function (properties) {
  var map = []

  for (var key in properties) {
    if (properties.hasOwnProperty(key)) {
      map.push(new CSSComputedStyleProperty(key, properties[key].value))
    }
  }

  return map
}


module.exports = CSS
