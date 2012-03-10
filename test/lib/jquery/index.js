module.exports = function (fn) {

  'use strict';

  var
    jQueryVersion = process.env.JQUERY_VERSION || '1.7.1',
    path = require('path'),
    fs = require('fs'),
    jsdom = require('jsdom');

  console.log('Testing Ninja UI', version, 'with jQuery', jQueryVersion);

  jsdom.env({
    html: '<html><head></head><body></body></html>',
    src: [
      fs.readFileSync(path.resolve('test/lib/jquery', jQueryVersion + '.min.js'), 'utf8'),
      fs.readFileSync(path.resolve('dist', version, 'jquery.ninjaui.min.js'), 'utf8')
    ],
    done: function (errors, window) {
      if (errors) {
        throw(errors);
      }
      fn(window.$);
    }
  });
};
