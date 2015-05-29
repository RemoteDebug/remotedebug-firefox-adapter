var util = require('util')
var Core = require('./core')

function DOMNodeCache (server, client) {
  this.domIndex = {}
}

util.inherits(DOMNodeCache, Core)

DOMNodeCache.prototype.getNode = function (pageId, nodeId) {
  return this.domIndex[pageId] && this.domIndex[pageId][nodeId]
}

DOMNodeCache.prototype.buildPageDomIndex = function (pageId, documentNode) {
  this._buildDomIndex(pageId, documentNode)
}

DOMNodeCache.prototype._buildDomIndex = function (pageId, node) {
  var index = this.domIndex[pageId]
  if(!index)  {
    this.domIndex[pageId] = {}
    index = this.domIndex[pageId]
  }

  index[node.nodeId] = node

  if (node.children && node.children.length) {
    node.children.forEach(function (subNode) {
      this._buildDomIndex(pageId, subNode)
    }.bind(this))
  }

}

module.exports = DOMNodeCache
