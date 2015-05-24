var WebSocket = require('ws')

var ws = new WebSocket('ws://localhost:9222/devtools/page/0D08B5CB-B5E9-417F-A36B-50BEDAACC98A')

ws.on('error', function (err) {
  console.log('error', err)
})

ws.on('open', function (err) {
  if (err) console.error(err)

  var req = {
    method: 'Page.startScreencast',
    id: 1
  }
  ws.send(JSON.stringify(req))
})

ws.on('message', function (msg) {
  console.log('received: %s', msg)
})
