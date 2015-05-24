var CSSProperty = require('./CSSProperty')

function CSSStyle (cssText) {
  this.styleId = null
  this.cssProperties = []
  this.shorthandEntries = []
  this.cssText = cssText
  this.range = null
  this.width = '0px'
  this.height = '0px'

  this._parseCSSTextToProperties()
}

CSSStyle.prototype = {
  _updateId: function () {
    var extractedId = this.ruleId.match(/conn(.*).domstylerule(.*)/)[2]
    this.ruleId = parseInt(extractedId, 10)
  },

  _parseCSSTextToProperties: function () {
    // TODO: Improve parser - optimistic
    if (!this.cssText) {
      return
    }

    this.cssProperties = this.cssText.split(';').map(function (pair) {
      var set = pair.split(':')
      var prop = new CSSProperty()

      if (set.length === 2) {
        prop.name = set[0].trim()
        prop.value = set[1].trim()
      }

      return prop
    })

  }
}

module.exports = CSSStyle
