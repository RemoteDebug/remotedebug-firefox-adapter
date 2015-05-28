var util = require('util')
var Core = require('../lib/core')

function Info (server, client) {
  this.initialize(server, client)
  this.server.on('Info.getInfo', this.getInfo.bind(this))
}

util.inherits(Info, Core)

Info.prototype.getInfo = function (req) {
  this.client.getTabs().then(function (tabs) {
    var data = this._formatTabs(tabs)
    req.reply(data)
  }.bind(this))
}

Info.prototype._formatTabs = function (tabs) {
  return tabs.map(function (tab) {
    return {
      description: '',
      devtoolsFrontendUrl: '/devtools/devtools.html?ws=localhost:' + this.server.port + '/devtools/page/' + tab.tab.actor,
      devtoolsUrl: 'chrome-devtools://devtools/bundled/devtools.html?ws=localhost:' + this.server.port + '/devtools/page/' + tab.tab.actor + '&remoteFrontend=true',
      id: tab.tab.actor,
      title: tab.title,
      type: 'page',
      url: tab.url,
      webSocketDebuggerUrl: 'ws://localhost:' + this.server.port + '/devtools/page/' + tab.tab.actor
    }
  }.bind(this))
}

module.exports = Info
