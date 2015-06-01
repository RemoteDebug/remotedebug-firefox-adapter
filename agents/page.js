var util = require('util')
var Core = require('../lib/core')
var PageFrame = require('../objects/pageFrame')

function Page (server, client) {
  this.initialize(server, client)
  this.server.on('Page.enable', this.enable.bind(this))
  this.server.on('Page.navigate', this.navigate.bind(this))
  this.server.on('Page.reload', this.reload.bind(this))
  this.server.on('Page.canEmulate', this.canEmulate.bind(this))
  this.server.on('Page.hasTouchInputs', this.hasTouchInputs.bind(this))
  this.server.on('Page.canScreencast', this.canScreencast.bind(this))
  // this.server.on('Page.startScreencast', this.startScreencast.bind(this))
  // this.server.on('Page.stopScreencast', this.stopScreencast.bind(this))
  this.screncastingInterval;
}

util.inherits(Page, Core)

Page.prototype.enable = function (request) {
  request.reply(true)
}

Page.prototype.canEmulate = function (request) {
  request.reply(false)
}

Page.prototype.canScreencast = function (request) {
  request.reply({
    result: false
  })
}

Page.prototype.hasTouchInputs = function (request) {
  request.reply(false)
}

Page.prototype.reload = function (request) {
  var page = this.client.getPage(request.data.pageId)
  page.reload()
}

Page.prototype.navigate = function (request) {
  var page = this.client.getPage(request.data.pageId)
  var url = request.data.params.url

  page.navigateTo(url, function () {
    request.sendNotification('Page.frameNavigated', {
      frame: new PageFrame(url)
    })

    setTimeout(function () {
      // TODO: This event should be fired, whne we get told from Firefox, but I don't know how to listen to that event yet.
      request.sendNotification('Page.loadEventFired', {
        timestamp: new Date().getTime()
      })
    }, 2000)
  })
}

Page.prototype.startScreencast = function (req) {

  var page = this.client.getPage(req.data.pageId)

  var captureScreencastFrame = function () {
    page.Device.screenshotToDataURL(function(err, screenData) {
      // page.DOM.document(function (err, elmDocument) {

        screenData = screenData.replace('data:image/png;base64,', '')

        var params = {
          data: screenData,
          metadata: {
            pageScaleFactor: 1,
            offsetTop: 0,
            deviceWidth: 1000,
            deviceHeight: 1000,
            scrollOffsetX: 0,
            scrollOffsetY: 0
          }
        }

        req.sendNotification('Page.screencastFrame', params)

      // });
    })
  }

  this.screncastingInterval = setInterval(captureScreencastFrame, 1000)

}

Page.prototype.stopScreencast = function (req) {
  if (this.screncastingInterval) {
    clearInterval(this.screncastingInterval)
  }
}

module.exports = Page
