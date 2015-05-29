var util = require('util')
var Core = require('../lib/core')
var DomNode = require('../objects/domNode')
var logger = require('../lib/logger')


function DOM (server, client, domNodeCache) {
  this.initialize(server, client)

  this.server.on('DOM.getDocument', this.getDocument.bind(this))
  this.server.on('DOM.highlightNode', this.highlightNode.bind(this))
  this.server.on('DOM.hideHighlight', this.hideHighlight.bind(this))
  this.server.on('DOM.setAttributesAsText', this.setAttributesAsText.bind(this))
  this.server.on('DOM.getAttributes', this.getAttributes.bind(this))
  this.server.on('DOM.markUndoableState', this.markUndoableState.bind(this))
  this.server.on('DOM.setInspectedNode', this.setInspectedNode.bind(this))
  this.server.on('DOM.requestChildNodes', this.requestChildNodes.bind(this))

  this.domNodeCache = domNodeCache
  this._sentCSS = false
}

util.inherits(DOM, Core)

DOM.prototype.getDocument = function (req) {
  var page = this.client.getPage(req.data.pageId)

  page.DOM.document(function (err, elmDocument) {
    if (err) throw new Error(err)

    var node = new DomNode(elmDocument)
    node.buildTree(3).then(function () {
      this.domNodeCache.buildPageDomIndex(req.data.pageId, node)

      var res = {
        root: node.toJSON()
      }

      req.reply(res)

    }.bind(this))

  }.bind(this))
}

DOM.prototype.highlightNode = function (request) {
  var page = this.client.getPage(request.data.pageId)
  var node = this.domNodeCache.getNode(request.data.pageId, request.data.params.nodeId)

  logger.info('DOM.highlightNode', request.data.params.nodeId)

  if(!node) return

  logger.info('DOM.highlightNode.node', node.geckoNode.nodeType)

  page.Styles.showBoxModel(node.geckoNode.actor, function (err, response) {
    if (err) throw new Error(err)

    request.reply({

    })

  }.bind(this))


}

DOM.prototype.hideHighlight = function (req) {
  var page = this.client.getPage(req.data.pageId)
  page.Styles.hideBoxModel(function (err, response) {
    if (err) throw new Error(err)
  }.bind(this))

  // Chrome dev tools never requests CSS files, but always sends "hideHighlight" command around when it expects to get the CSS files.
  // this hack will do until we implement a better way to post events.
  if (!this._sentCSS) {
    this._sendStylesheets(req);
    this._sentCSS = true;
  }

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
}

DOM.prototype.setInspectedNode = function (req) {
  req.reply({
  })
}

DOM.prototype.requestChildNodes = function (req) {

  var node = this.domNodeCache.getNode(req.data.pageId, req.data.params.nodeId)

  logger.info('DOM.requestChildNodes', req.data.pageId, req.data.params.nodeId)

  if(!node) {
    logger.info('DOM.requestChildNodes', req.data.params.nodeId, 'NOT FOUND')
    return
  }

  node.buildTree(1).then(function () {
    this.domNodeCache.buildPageDomIndex(req.data.pageId, node)

    var params = {
      parentId: req.data.params.nodeId,
      nodes: node.getChildren()
    }

    req.sendNotification('DOM.setChildNodes', params)

  req.reply({

  })

  }.bind(this))



}

DOM.prototype._sendStylesheets = function(req) {

  var page = this.client.getPage(req.data.pageId)

  console.log('_sendStylesheets');

  page.StyleSheets.getStyleSheets(function (err, styleSheets) {

    console.log('_sendStylesheets', err, styleSheets);

    styleSheets.forEach(function(stylesheet) {
      var header = {
        styleSheetId: stylesheet.actor,
        origin: "regular",
        disabled: stylesheet.disabled,
        sourceURL: stylesheet.href,
        title: stylesheet.href,
        frameId: "1500.1",
        isInline: "false",
        startLine: "0",
        startColumn: "0",
        ownerNode: stylesheet.ownerNode
      }

      req.sendNotification('CSS.styleSheetAdded', {
        header: header
      })
    });

  }.bind(this))

}
module.exports = DOM
