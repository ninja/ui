/*globals
  $versions, test, equal, ok
*/

/*jshint
  bitwise: true, browser: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 2, jquery: true, maxerr: 3, newcap: true, noarg: true, noempty: true, nomen: true, nonew: true, regexp: true, strict: true, undef: true, white: true
*/

$versions('1.5', '1.5.1', '1.5.2').load('../lib/jquery.ninja.ui.js').execute(function ($, jQuery, version) {

  'use strict';
  
  module('With jQuery ' + version);

  test('should load jQuery and Ninja UI.', function () {
    equal(jQuery.fn.jquery, version, 'jQuery ' + version + ' loaded.');
    ok($.ninja(), 'Ninja UI loaded.');
  });
  
  test('should create a button named Sue', function () {
    ok($.ninja().button({
      html: 'Sue'
    }), 'button named Sue created');
  });
});
