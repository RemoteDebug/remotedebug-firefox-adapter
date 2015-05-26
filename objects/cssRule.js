var CSSStyle = require('./CSSStyle')

function CSSRule (geckoRule) {
  console.log('CSSStyle.geckoRule', geckoRule);

  //  StyleSheetId is needed for edit-mode
  // this.styleSheetId = geckoRule.parentStyleSheet

  this.selectorList = { // <List>SelectorList
    selectors: geckoRule.selectors ? geckoRule.selectors : [],
    range: null
  }
  this.origin = 'regular' // Stylesheet type: "user" for user stylesheets, "user-agent" for user-agent stylesheets, "inspector" for stylesheets created by the inspector (i.e. those holding the "via inspector" rules), "regular" for regular stylesheets.
  this.style = new CSSStyle(geckoRule.cssText)
  this.media = []

}

CSSRule.prototype = {

}

module.exports = CSSRule
