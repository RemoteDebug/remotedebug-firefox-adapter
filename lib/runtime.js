var extend = require('./extend');
var Core = require('./core');
var RemoteObject = require('./runtime.remoteobject');

function Runtime(server, client) {
    this.initialize(server, client);
    this.server.on('Runtime.enable', this.enable.bind(this));
    this.server.on('Runtime.evaluate', this.evaluate.bind(this));
    this.server.on('Runtime.callFunctionOn', this.callFunctionOn.bind(this));

}

Runtime.prototype = extend(Core, {

    enable: function(request) {
        request.reply(true);
    },

    evaluate: function(request) {

        //  this.log('request', request);

        var page = this.client.getPage(request.data.pageId);
        var expression = request.data.params.expression;

        // Workaround for Adobe Brackets.
        if(expression === 'window.open(\'\', \'_self\').close();') {
            request.reply({
                result: {
                    value: undefined,
                    type: 'undefined'
                },
                wasThrown: false
            });

            return;
        }

        page.Console.evaluateJS(expression, function(err, data) {
            console.log('evaluateJS', data);

            if(typeof data.result.obj !== 'object') {

                request.reply({
                    result: new RemoteObject(typeof(data.result), data.result),
                    wasThrown: false
                });

            } else {

                var objectId = data.result.obj.actor;
                request.reply({
                    result: new RemoteObject('null', null, objectId),
                    wasThrown: false
                });

            }

            if (data.exception) {
                return request.sendNotification('Console.messageAdded', {
                    message : {
                        level: 'error',
                        text: data.exceptionMessage
                    }
                });
            }

            if (data.result) {
                return request.sendNotification('Console.messageAdded', {
                    message : {
                        level: 'log',
                        parameter: [{
                            value: data.result.obj
                        }]
                    }
                });
            }


        }.bind(this));
    },

    callFunctionOn: function(request) {

        var page = this.client.getPage(request.data.pageId);

        var functionDeclaration = request.data.params.functionDeclaration;
        var argumentsAsString = request.data.params.arguments ? request.data.params.arguments.map(function(argument){
            return JSON.stringify(argument.value);
        }).join(', ') : '';

        var functionCall = functionDeclaration + '(' + argumentsAsString + ')';

        page.Console.evaluateJS(functionCall, function(err, data) {

            request.reply({
                result: new RemoteObject(typeof(data.result), data.result),
                wasThrown: false
            });

        }.bind(this));

    }

});

module.exports = Runtime;
