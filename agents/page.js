var Core = require("../lib/core");
var extend = require("../lib/extend");
var PageFrame = require("../models/pageFrame");

function Page(server, client) {
    this.initialize(server, client);
    this.server.on("Page.enable", this.enable.bind(this));
    this.server.on("Page.navigate", this.navigate.bind(this));
    this.server.on("Page.reload", this.reload.bind(this));
    this.server.on("Page.canScreencast", this.canScreencast.bind(this));
}

Page.prototype = extend(Core, {

    enable: function(request) {
        request.reply(true);
    canScreencast: function(request) {
        request.reply(false);
    },
    reload: function(request) {
        var page = this.client.getPage(request.data.pageId);
        page.reload();
    },

    navigate: function(request) {

        var page = this.client.getPage(request.data.pageId);
        var url = request.data.params.url;

        page.navigateTo(url, function() {
            request.sendNotification('Page.frameNavigated', {
                frame: new PageFrame(url)
            });

            setTimeout(function() {
                // TODO: This event should be fired, whne we get told from Firefox, but I don't know how to listen to that event yet.
                request.sendNotification('Page.loadEventFired', {
                    timestamp: (new Date).getTime()
                });
            }.bind(this), 2000);


        });

    }

});

module.exports = Page;
