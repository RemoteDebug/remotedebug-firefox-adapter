# RemoteDebug bridge for Firefox

This project is aimed to provide a RemotoDebug brige for Firefox. This brige enables tools who supports RemoteDebug,like Chrome DevTools, to communicate with Firefox.

<insert animated gif here>

## Getting started
1. npm install
2. Start Firefox
3. Enable remote debugging in Firefox (type "listen 6000" in Web Console)
4. npm start
5. Go to http://localhost:8080/json in Chrome.
6. Choose the right Chrome WebTools endpoint.
7. Bam! Champagne!

##  How to enable remote debugging in Firefox (Linux).

To enable remote debugging on the device, you need to set the devtools.debugger.remote-enabled preference to true.

Go to about:config in Firefox for Android, type "devtools" into the search box and press the Search key. You'll see all the devtools preferences. Find the devtools.debugger.remote-enabled preference, and press "Toggle".


