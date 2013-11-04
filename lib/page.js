var extend = require("./extend");
var Core = require("./core");
var PageFrame = require("./page.frame");

function Page(server, client) {
    this.initialize(server, client);
    this.server.on("Page.enable", this.enable.bind(this));
    this.server.on("Page.navigate", this.navigate.bind(this));
}

Page.prototype = extend(Core, {

    enable: function(request) {
        request.reply(true);
    },

    navigate: function(request) {

        var page = this.client.getPage(request.data.pageId);
        var url = request.data.params.url;

        page.navigateTo(url, function() {
            request.sendNotification('Page.frameNavigated', {
                frame: new PageFrame(url)
            });

            // TODO: This event should be fired, whne we get told from Firefox, but I don't know how to listen to that event yet.
            request.sendNotification('Page.loadEventFired', {
                timestamp: (new Date).getTime()
            });

        });

    }

});

module.exports = Page;
