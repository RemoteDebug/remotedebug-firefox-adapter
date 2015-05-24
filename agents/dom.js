var util = require('util')
var Core = require('../lib/core')
var DomNode = require('../objects/domNode')

function DOM (server, client, domNodeCache) {
  this.initialize(server, client)

  this.server.on('DOM.getDocument', this.getDocument.bind(this))
  this.server.on('DOM.highlightNode', this.highlightNode.bind(this))
  this.server.on('DOM.hideHighlight', this.hideHighlight.bind(this))
  this.server.on('DOM.setAttributesAsText', this.setAttributesAsText.bind(this))
  this.server.on('DOM.getAttributes', this.getAttributes.bind(this))
  this.server.on('DOM.markUndoableState', this.markUndoableState.bind(this))
  this.server.on('DOM.setInspectedNode', this.setInspectedNode.bind(this))

  this.domNodeCache = domNodeCache
}

util.inherits(DOM, Core)

DOM.prototype.getDocument = function (request) {
    var page = this.client.getPage(request.data.pageId)

    page.DOM.document(function (err, elmDocument) {
      if (err) throw new Error(err)

      var node = new DomNode(elmDocument)
      node.build().then(function () {
        this.domNodeCache.buildPageDomIndex(request.data.pageId, node)

        var res = {
          root: node.toJSON()
        }

        request.reply(res)

      }.bind(this))

    }.bind(this))
  }

DOM.prototype.highlightNode = function (request) {
  var node = this.domNodeCache.getNode(request.data.pageId, request.data.params.nodeId)
  if (!node) return

  console.log('node.geckoNode', node.geckoNode)

  node.geckoNode.highlight(function () {

  })
}

DOM.prototype.hideHighlight = function (request) {
  var page = this.client.getPage(request.data.pageId)
  page.DOM.document(function (err, elmDocument) {
    if (!err) {
      elmDocument.unhighlight(function () {})
    }
  })
}

DOM.prototype.setAttributesAsText = function (request) {
  var node = this.domNodeCache.getNode(request.data.pageId, request.data.params.nodeId)
  var text = request.data.params.text

  if (!node) return

  // TODO: Improve parser - really optimistic
  text.split(' ').forEach(function (pair) {
    var set = pair.split('=')

    if (set.length !== 2) {
      return
    }

    var name = set[0].trim().replace('"', '')
    var value = set[1].trim().replace('"', '')

    node.geckoNode.setAttribute(name, value, function () {})
  })
}

DOM.prototype.getAttributes = function (req) {
  req.reply({

  })
}

DOM.prototype.markUndoableState = function (req) {
  req.reply({

  })
},

DOM.prototype.setInspectedNode = function (req) {
  req.reply({

  })
}

module.exports = DOM
