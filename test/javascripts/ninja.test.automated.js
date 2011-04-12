/*globals
  $versions, test, equal, ok
*/

/*jshint
  bitwise: true, browser: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 2, jquery: true, maxerr: 3, newcap: true, noarg: true, noempty: true, nomen: true, nonew: true, regexp: true, strict: true, undef: true, white: true
*/

$versions('1.5', '1.5.1', '1.5.2').load('../lib/jquery.ninja.ui.js').execute(function ($, jQuery, version) {

  'use strict';


  module('Infrastructure Verification Tests with jQuery 1.5');

  test('should load jQuery.', function () {
    equal(jQuery.fn.jquery, version, 'jQuery loaded.');
  });

  test('should load Ninja UI.', function () {
    ok($.ninja(), 'Ninja UI loaded.');
  });
  
  test('should create a button named Sue', function () {
    var orig_count = $("span.ninjaButton:contains('Sue')").length;
    var sueButton = $.ninja().button({


  module('DOM manipulation tests ');

  test('should create a button named "New"', function () {
    var newButton = $.ninja().button({
      html: 'New'
    });
    $('#qunit-fixture').append(newButton);

    equal($("#qunit-fixture .ninjaButton").text(), "New", 'created "New" button');
  });


});
