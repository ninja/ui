$ = null;

version = require('../../package.json').version;

require('./jquery')(function (jQuery) {
  $ = jQuery;
});

expect = require('expect.js');
