# Mozilla Firefox Remote Debugging to RemoteDebug protocol bridge.

This project provides a Mozilla Firefox Remote Debugging to RemoteDebug protocol bridge, to enable communication with tools like Chrome DevTools.

<insert animated gif here>

## Getting started
1. npm install
2. Start Firefox (Aurora or Nightly to get all features)
3. Enable remote debugging in Firefox (type "listen 6000" in Web Console)
4. npm start
5. Open http://localhost:8080/json in Chrome.
6. Locate your tab in the json-output, and open the ```devtoolsUrl``` url in Chrome.
7. Bam! Champagne!

##  How to enable remote debugging in Firefox on Linux?

To enable remote debugging on the device, you need to set the devtools.debugger.remote-enabled preference to true.

Go to about:config in Firefox for Android, type "devtools" into the search box and press the Search key. You'll see all the devtools preferences. Find the devtools.debugger.remote-enabled preference, and press "Toggle".



