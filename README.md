# RemoteDebug Firefox Adaptor.

**DEPRECATION: This protocol adapter has never left it's experimantal stage, and does currently nok work with Chrome DevTools, as the Remote Debugging API's have diverged. If you want to collaborate please reach out to me.**


This is a protocol adaptor that allows you to remote debug Firefox instances via [RemoteDebug](http://remotedebug.org), aka Chrome Debugging protocol, with tools like Chrome DevTools.

![](https://raw.github.com/auchenberg/remotedebug-firefox-bridge/master/readme/animation.gif)

## Getting started

1. Run `npm install`
2. Start Firefox with remote debugging enabled using `path/to/firefox --start-debugger-server`
3. Run `npm start`
4. Open `http://localhost:9222/json` in Chrome.
5. Locate your tab in the json-output, and open the `devtoolsUrl` url in Chrome.
6. Bam! Champagne!

## Status
This project is in the very early stage. The basic shell is there to expose a RemoteDebug compliant server: Listen and trigger notifications, handle multiple connections, etc.

Current supported operations:
- Console: Evaluate expression
- DOM: getDocument
- DOM: highlightNode
- DOM: hideHighlight
- DOM: setAttributesAsText

## FAQ
###  How to enable remote debugging in Firefox?

#### Linux
To enable remote debugging on the device, you need to set the devtools.debugger.remote-enabled preference to true.

Go to about:config in Firefox for Android, type "devtools" into the search box and press the Search key. You'll see all the devtools preferences. Find the devtools.debugger.remote-enabled preference, and press "Toggle".

#### Mac
Should already be enabled.


