var WebSocket = require('ws');

var ws = new WebSocket('ws://localhost:9222/devtools/page/30CD1167-465E-B730-8980-1A9EC0C2F7CC');

ws.on('error',function(error) {
  console.log('error', error);
});

ws.on('open', function(err) {

  var req = {
    method: 'DOM.getDocument',
    id: 1
  };

  ws.send(JSON.stringify(req));

});

ws.on('message', function(message) {
  console.log('received: %s', message);
});
