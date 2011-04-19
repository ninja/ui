/*globals
  $versions, test, equal, ok, expect, module
*/

/*jshint
  bitwise: true, browser: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 2, jquery: true, newcap: true, noarg: true, noempty: true, nomen: true, nonew: true, regexp: true, strict: true, undef: true, white: false
*/

$versions('1.5.2', '1.5.1', '1.5').load('../lib/jquery.ninja.ui.js').execute(function ($, jQuery, version) {

  'use strict';

  module('Infrastructure with jQuery ' + version);

    test('should load jQuery and Ninja UI', function () {
      expect(2);
      equal(jQuery.fn.jquery, version, 'jQuery');
      ok($.ninja(), 'Ninja UI');
    });


  module('.button()');

    test("should be in Ninja UI's default button classes", function () {
      expect(5);
      ok($.ninja().button().hasClass('ninja'), '.ninja');
      ok($.ninja().button().hasClass('ninjaButton'), '.ninjaButton');
      ok($.ninja().button().hasClass('ninjaBorder'), '.ninjaBorder');
      ok($.ninja().button().hasClass('ninjaInline'), '.ninjaInline');
      ok($.ninja().button().hasClass('ninjaUnselectable'), '.ninjaUnselectable');
    });

    test("should be in Ninja UI's gradiant class depending on how it was called", function () {
      expect(3);
      ok($.ninja().button({gradient: true}).hasClass('ninjaGradient'), '.ninjaGradient if requested');
      ok(!$.ninja().button({gradient: false}).hasClass('ninjaGradient'), 'not .ninjaGradient if not requested');
      ok($.ninja().button().hasClass('ninjaGradient'), '.ninjaGradient if no request either way');
    });

    test("should accept css overrides on creation", function () {
      expect(1);
      equal($.ninja().button({css: {margin: '20em'}}).css('margin'), '20em', "making them visible in jQuery's .css()");
      // Note that different browsers are not consistent in how they deal with invalid styles.
    });

    test("should accept html content on creation", function () {
      expect(1);
      $('#qunit-fixture').append($.ninja().button({html: 'New Button'}));
      equal($("#qunit-fixture .ninjaButton").text(), "New Button", "which jQuery can then render");
    });

});
