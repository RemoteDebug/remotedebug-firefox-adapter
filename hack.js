var WebSocketServer = require('ws').Server;
var FirefoxClient = require("firefox-client");
var Node = require("./node");
var Q = require("q");
var port = 8080;
var firefoxPort = 6000;

var currentTab = null;

var wss = new WebSocketServer({
  port: port
});

console.log('Chrome end-point started on port ' + port);

var client = new FirefoxClient();
client.on('error', function(error) {
  console.log('Firefox: Something went wrong', error);
});

client.connect(firefoxPort, function() {

  console.log('Connected to Firefox on port' + firefoxPort);

  client.listTabs(function(err, tabs) {
    console.log('currentTab set');
    var tab = tabs[0];
    currentTab = tab;
  });
});


wss.on('connection', function(ws) {

  console.log('Clien connected. ' + ws);

  ws.on('message', function(message) {

    var msg = JSON.parse(message);

    console.log('** REQ:' + msg.method);

    if(msg.method === 'DOM.getDocument') {

      currentTab.DOM.document(function(err, elmDocument) {
        var node = new Node(elmDocument);
        node.build(elmDocument).then(function() {

          var res = {
            result: {
              root : node.toJSON()
            },
            id: msg.id
          };

          console.log('DOM.getDocument', res);

          return ws.send(JSON.stringify(res));

        });
      });

    } else {

      console.log('received: %s', message);

      var res = {
        result: null,
        error: null,
        id: msg.id
      };

      ws.send(JSON.stringify(res));
    }

  });


});
