/*globals
  $versions, test, equal, ok, expect, module
*/

/*jshint
  bitwise: true, browser: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 2, jquery: true, newcap: true, noarg: true, noempty: true, nomen: true, nonew: true, regexp: true, strict: true, undef: true, white: false
*/

var scriptPath;
var development = decodeURI((new RegExp('environment' + '=' + '(.+?)(&|$)').exec(location.search) || [null])[1]) === 'development';

if (development) {
  scriptPath = '../src/ninjaui.js';
}
else {
  scriptPath = '../jquery.ninjaui.min.js';
}

$versions('1.7', '1.6.4', '1.6.3', '1.6.2', '1.6.1', '1.6', '1.5.2', '1.5.1', '1.5').load(scriptPath).execute(function ($, jQuery, version) {

  'use strict';

  module('Load with jQuery ' + version);

    test('should load jQuery and Ninja UI', function () {
      expect(2);
      equal(jQuery.fn.jquery, version, 'jQuery');
      ok($.ninja(), 'Ninja UI');
    });

    if (development) {
      test('should return Ninja UI version', function () {
        expect(1);
        equal($.ninja().version(), 'development', 'Ninja UI version: development');
      });
    }

  module('.button()');

    test('should have Ninja UI\'s default class', function () {
      expect(1);
      ok($.ninja().button().hasClass('ninja'), '.ninja');
    });

    test('should accept css overrides on creation', function () {
      expect(1);
      equal($.ninja().button({css: {margin: '20em'}}).css('margin'), '20em', 'making them visible in jQuery\'s .css()');
      // Note that different browsers are not consistent in how they deal with invalid styles.
    });

    test('should accept html content on creation', function () {
      expect(1);
      $('#qunit-fixture').append($.ninja().button({html: '<b>New</b> Button'}));
      equal($('#qunit-fixture .ninja').html(), '<b>New</b> Button', 'which jQuery can then render');
    });

});
