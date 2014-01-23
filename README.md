# Firefox to RemoteDebug protocol bridge.

This project provides a Mozilla Firefox Remote Debugging to [RemoteDebug protocol](http://remotedebug.org) bridge, to enable communication with tools like Chrome DevTools.

![](https://raw.github.com/auchenberg/remotedebug-firefox-bridge/master/animation.gif)

## Getting started

### 1. Setup RemoteDebug.
1. Checkout this repo.
1. npm install

### 2. Setup Firefox - by enabling remote debugging in Firefox (You'll only have to do this once).
1. Start Firefox (Aurora or Nightly to get all features)
2. Open the DevTools. Web Developer > Toggle Tools
3. Visit the settings panel (gear icon)
4. Check "Enable remote debugging" under Advanced Settings

### 3. Make Firefox listen for incoming connections (has to be done everytime you start Firefox).
1. Open the Firefox command line with Tools > Web Developer > Developer Toolbar.
2. Start a server by entering this command: ```listen 6000``` (where 6000 is the port number)

### 4. Start RemoteDebug.
4. npm start
5. Open http://localhost:9222/json in Chrome.
6. Locate your tab in the json-output, and open the ```devtoolsUrl``` url in Chrome.
7. Bam! Champagne!

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


