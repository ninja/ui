'use strict';

global.expect = require('expect.js');
global.version = require('package.json').version;

var
  fs = require('fs'),
  path = require('path');

require('jsdom').env({
  html: '<html><head></head><body></body></html>',
  src: [
    fs.readFileSync(path.resolve('test/jquery', process.env.JQUERY_VERSION + '.min.js'), 'utf8'),
    fs.readFileSync(path.resolve('dist', global.version, 'jquery.ninjaui.min.js'), 'utf8')
  ],
  done: function (errors, window) {
    if (errors) {
      throw (errors);
    }
    global.$ = window.$;
  }
});
