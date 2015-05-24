var util = require('util')
var Core = require('./core')

function DOMNodeCache (server, client) {
  this.domIndex = {}
}

util.inherits(DOMNodeCache, Core)

DOMNodeCache.prototype.getNode = function (pageId, nodeId) {
  return this.domIndex[pageId][nodeId]
}

DOMNodeCache.prototype.buildPageDomIndex = function (pageId, documentNode) {
  this.domIndex[pageId] = this._buildDomIndex(pageId, documentNode)
}

DOMNodeCache.prototype._buildDomIndex = function (pageId, node, array) {
  var index = array ? array : {}

  index[node.nodeId] = node

  if (node.children.length) {
    node.children.forEach(function (subNode) {
      this._buildDomIndex(pageId, subNode, index)
    }.bind(this))
  }

  return index
}

module.exports = DOMNodeCache
