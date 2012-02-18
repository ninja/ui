"use strict";

var
  version = require('../package.json').version,
  colors = require('colors'),
  /*
    bold, inverse, italic, underline
    blue, cyan, green, grey, magenta, red, white, yellow
  */
  iconPass = '\u2714'.green,
  iconFail = '\u2717'.red,

  path = require('path'),
  dirtest = path.resolve(__dirname, '..', 'test'),

  fs = require('fs'),

  jsdom = require('jsdom'),
  assert = require('assert'),
  testCount = 0,
  versionCount = 1,
  test = function ($, name, fn) {
    try {
      fn();
    } catch (error) {
      console.error(iconFail, 'test failed:  ', name, '(jQuery', $.fn.jquery + ')');
      console.error('                ', error.message.bold);
      process.exit(1);
    }
    if (versionCount === 1) {
      testCount++;
    }
  },
  versions = ['1.7.1', '1.7.0', '1.6.4', '1.6.3', '1.6.2', '1.6.1', '1.6.0'];

versions.forEach(function (jQueryVersion) {

  jsdom.env({
    html: '<html><head></head><body></body></html>',
    src: [
      fs.readFileSync(path.resolve(dirtest, 'jquery', jQueryVersion + '.min.js'), 'utf8'),
      fs.readFileSync(path.resolve(__dirname, '..', 'dist', version, 'jquery.ninjaui.min.js'), 'utf8')
    ],
    done: function (errors, window) {
      if (errors) {
        console.error(errors);
        process.exit(1);
      }
      var
        $ = window.$,
        document = window.document;
      require(path.resolve(dirtest, 'core.js'))($, window, document, test, assert, version);
      require(path.resolve(dirtest, 'button.js'))($, window, document, test, assert);
      versionCount++;
      if (versionCount === versions.length) {
        console.log(iconPass, 'tested:       ', testCount, 'tests passed', versions.length, 'versions of jQuery(' + versions[versions.length - 1], '-', versions[0] + ')');
        console.log('');
      }
    }
  });

});
