var Promise = require('es6-promise').Promise

function DomNode (geckoNode) {
  this.geckoNode = geckoNode

  this.nodeId = 0
  this.nodeName = geckoNode.nodeName
  this.localName = geckoNode.localName || geckoNode.nodeName
  this.nodeType = geckoNode.nodeType
  this.nodeValue = geckoNode.nodeValue || ''
  // this.xmlVersion = geckoNode.xmlVersion || ''
  this.childNodeCount = geckoNode.numChildren || 0
  // this.children = []
  // this.documentURL = 'http://kenneth.io'
  // this.baseURL = 'http://kenneth.io'
  this.attributes = []

  this._updateNodeId()
  this._mapAttributes()
}

DomNode.prototype = {

  buildTree: function (maxDepth, currentDepth) {

    return this._getChildren(maxDepth, currentDepth)
  },

  toJSON: function () {
    var data = {
      nodeId: this.nodeId,
      nodeName: this.nodeName,
      localName: this.localName,
      nodeType: this.nodeType,
      nodeValue: this.nodeValue,
      xmlVersion: this.xmlVersion,
      childNodeCount: this.childNodeCount,
      documentURL: this.documentURL,
      baseURL: this.baseURL,
      attributes: this.attributes
    }

    if(this.children) {
      data.children = this.children.map(function (item) {
        return item.toJSON()
      })
    }

    return data

  },

  getChildren: function() {

    if(this.children) {
      return this.children.map(function (item) {
        return item.toJSON()
      })
    } else {
      return []
    }

  },

  _mapAttributes: function () {
    if (!this.geckoNode.attrs) {
      return
    }

    this.attributes = this.geckoNode.attrs.reduce(function (pre, cur, index) {
      return pre.concat([cur.name,cur.value])
    }, [])
  },

  _getChildren: function (maxDepth, currentDepth) {
    var that = this
    currentDepth = currentDepth || 1

    return new Promise(function (resolve, reject) {
      that.geckoNode.children(function (err, nodes) {
        if (err) console.error(err)

        var childPromises = []
        var childNodes = nodes.map(function (node) {
          var n = new DomNode(node)
          var promise;
          if(currentDepth < maxDepth) {
            promise = n.buildTree(maxDepth, currentDepth+1)
          } else {
            promise = Promise.resolve(node)
          }
          childPromises.push(promise)
          return n
        })

        Promise.all(childPromises).then(function () {
          that.children = childNodes
          resolve(childNodes)
        })
      })
    })

  },

  _updateNodeId: function () {
    var extractedId = this.geckoNode.actor.match(/conn(.*).domnode(.*)/)[2]
    this.nodeId = parseInt(extractedId, 10)
  }

}

module.exports = DomNode
