/*
  Copyright 2008-2012 Jamie Hoover.
  Licensed per the terms of the Apache License v2.0. See README.md for details.

  Note: No testing for computed styles. HTML DOM/BOM only!
*/

/*jshint bitwise: true, browser: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 2, node: true, maxerr: 3, newcap: true, noarg: true, noempty: true, nomen: true, nonew: true, onevar: true, plusplus: false, regexp: true, strict: false, undef: true, white: true*/

module.exports = function ($, window, document, test, assert, version) {

  test($, '$.ninja.version() should equal package.json version', function () {
    assert.equal($.ninja.version(), version);
  });

  test($, 'styleheet should load and be base64 encoded', function () {
    var $stylesheet = $('head').find('link');
    assert.equal($stylesheet.attr('rel'), 'stylesheet');
    assert.equal($stylesheet.attr('type'), 'text/css');
    assert.equal($stylesheet.attr('href').substr(0, 21), 'data:text/css;base64,');
  });

};
