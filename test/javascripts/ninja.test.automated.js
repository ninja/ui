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
  

  module("Unit Tests: .ninja().button");

  test('should be in the global ninja class', function () {
    ok($.ninja().button().hasClass('ninja'));
  });

  test('should be in the ninjaButton class', function () {
    ok($.ninja().button().hasClass('ninjaButton'));
  });

  test('should be in the ninjaBorder class', function () {
    ok($.ninja().button().hasClass('ninjaBorder'));
  });

  test('should be in the ninjaInline class', function () {
    ok($.ninja().button().hasClass('ninjaInline'));
  });

  test('should be in the ninjaUnselectable class', function () {
    ok($.ninja().button().hasClass('ninjaUnselectable'));
  });

  test('should be in the ninjaGradient class if the flag was set true', function () {
    ok($.ninja().button({gradient: true}).hasClass('ninjaGradient'));
  });

  test('should not be in the ninjaGradient class if the flag was not set false', function () {
    ok(!$.ninja().button({gradient: false}).hasClass('ninjaGradient'));
  });

  test('should be in the ninjaGradient class if the flag was not set', function () {
    ok($.ninja().button().hasClass('ninjaGradient'));
  });



  module('DOM manipulation tests ');

  test('should create a button named "New"', function () {
    var newButton = $.ninja().button({
      html: 'New'
    });
    $('#qunit-fixture').append(newButton);

    equal($("#qunit-fixture .ninjaButton").text(), "New", 'created "New" button');
  });


});
