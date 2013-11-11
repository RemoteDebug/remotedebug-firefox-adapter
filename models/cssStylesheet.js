function CSSStylesheet(stylesheetId) {
    this.stylesheetId = stylesheetId;
    this.origin = 'regular';
    this.disabled = false;
    this.sourceURL = '';
    this.title = '';
    this.frameId = 1;
    this.isInline = false;
    this.startLine = 0;
    this.startColumn = 0;
}

CSSStylesheet.prototype = {

};

module.exports = CSSStylesheet;
