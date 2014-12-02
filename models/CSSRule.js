var CSSStyle = require('./CSSStyle');

function CSSRule(geckoRule) {

    console.log('geckoRule', geckoRule);

    this.ruleId = null;

    this.selectorList = {  //<List>SelectorList
        selectors : geckoRule.selectors ? geckoRule.selectors : [],
        range: null
    };
    this.sourceURL = 'http://remotedebug.org';
    this.sourceLine = geckoRule.line;
    this.origin = 'regular'; // Stylesheet type: "user" for user stylesheets, "user-agent" for user-agent stylesheets, "inspector" for stylesheets created by the inspector (i.e. those holding the "via inspector" rules), "regular" for regular stylesheets.
    this.style = new CSSStyle(geckoRule.cssText);
    this.media = [];

    //this._updateId(); Uncomment until StyleSheetId mapping is correct;
}

CSSRule.prototype = {
    _updateId: function(geckoRule) {

        var extractedId = geckoRule.actor.match(/conn(.*).domstylerule(.*)/)[2];

        this.ruleId = {
            styleSheetId : 0,
            ordinal: parseInt(extractedId, 10)
        };
    }
};

module.exports = CSSRule;
