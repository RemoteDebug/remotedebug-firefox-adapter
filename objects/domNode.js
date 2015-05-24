var Promise = require('es6-promise').Promise

function DomNode (geckoNode) {
  this.geckoNode = geckoNode

  this.nodeId = 0
  this.nodeName = geckoNode.nodeName
  this.localName = geckoNode.localName || ''
  this.nodeType = geckoNode.nodeType
  this.nodeValue = geckoNode.nodeValue || ''
  this.xmlVersion = geckoNode.xmlVersion || ''
  this.childNodeCount = geckoNode.numChildren || 0
  this.children = []
  this.documentURL = 'http://kenneth.io'
  this.baseURL = 'http://kenneth.io'
  this.attributes = []

  this._updateNodeId()
}

DomNode.prototype = {

  build: function () {
    this._mapAttributes()
    return this._getChildren()
  },

  toJSON: function () {
    return {
      nodeId: this.nodeId,
      nodeName: this.nodeName,
      localName: this.localName,
      nodeType: this.nodeType,
      nodeValue: this.nodeValue,
      xmlVersion: this.xmlVersion,
      childNodeCount: this.childNodeCount,
      children: this.children.map(function (item) {
        return item.toJSON()
      }),
      documentURL: this.documentURL,
      baseURL: this.baseURL,
      attributes: this.attributes
    }
  },

  _mapAttributes: function () {
    if (!this.geckoNode.attrs) {
      return
    }

    this.attributes = this.geckoNode.attrs.reduce(function (pre, cur, index) {
      return pre.concat([cur.name, cur.value])
    }, [])
  },

  _getChildren: function () {
    var that = this

    return new Promise(function (resolve, reject) {
      that.geckoNode.children(function (err, nodes) {
        if (err) console.error(err)

        var childPromises = []
        var childNodes = nodes.map(function (node) {
          var n = new DomNode(node)
          childPromises.push(n.build(node))
          return n
        })

        Promise.all(childPromises).then(function () {
          that.children = childNodes
          that.childNodeCount = that.children.length
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
