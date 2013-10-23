var extend = require("./extend");
var Core = require("./core");

function Console(server, client) {
    this.initialize(server, client);
    this.server.on("Page.enable", this.enable.bind(this));
    this.server.on("Runtime.evaluate", this.evaluate.bind(this));
}

Console.prototype = extend(Core, {

    enable: function(request) {
        request.reply(false);
    },

    evaluate: function(request) {

        //  this.log('request', request);

        var page = this.client.getPage(request.data.pageId);
        var expression = request.data.params.expression;

        page.Console.evaluateJS(expression, function(err, data) {
            console.log('evaluateJS', arguments);

            if(data.exception) {
                return request.sendNotification('Console.messageAdded', {
                    level: 'error'  ,
                    text: data.exceptionMessage
                });
            }

            if(data.result) {
                return request.sendNotification('Console.messageAdded', {
                    level: 'log',
                    parameter: [{
                        value: data.result.obj
                    }]
                });
            }


        }.bind(this));


    }

});

module.exports = Console;
