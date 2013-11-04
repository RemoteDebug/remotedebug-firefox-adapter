var colors = require('colors');

colors.setTheme({
  silly: 'rainbow',
  input: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  debug: 'grey',
  error: 'red'
});


var Logger = {

    log: function() {
        var args = Array.prototype.slice.call(arguments);
        console.log.apply(null, args);
    },

    info: function() {
        var args = Array.prototype.slice.call(arguments);
        args[0] = colors.info(args[0]);
        console.log.apply(null, args);
    },

    debug: function() {
        var args = Array.prototype.slice.call(arguments);
        args[0] = colors.debug(args[0]);
        console.log.apply(null, args);
    },

    error: function() {
        var args = Array.prototype.slice.call(arguments);
        args[0] = colors.error(args[0]);
        console.log.apply(null, args);
    },


};

module.exports = Logger;
