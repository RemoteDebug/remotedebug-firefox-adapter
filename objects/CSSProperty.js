function CSSProperty () {
  // https://github.com/admazely/inspector/blob/master/doc/CSS.md#class-cssproperty
  this.name = ''
  this.value = ''
  this.priority = ''
  this.implicit = false
  this.text = ''
  this.parsedOk = true
  this.status = ''
  this.range = null
}

module.exports = CSSProperty
