var extend = require('node.extend');
var logger = require('./logger');

function HttpRequest(httpResponse, method) {
    this.httpResponse = httpResponse;
    this.method = method;

    logger.info('httprequest.received:', this.method);
}

HttpRequest.prototype = extend({}, {

    reply: function(result) {
        logger.info('httprequest.reply', result);
        this.httpResponse.send(result);
    }

});

module.exports = HttpRequest;
