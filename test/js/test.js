/*globals
  QUnit, $versions, test, equal, ok, expect, module
*/

/*jshint
  bitwise: true, browser: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 2, jquery: true, newcap: true, noarg: true, noempty: true, nomen: true, nonew: true, regexp: true, strict: true, undef: true, white: false
*/

var scriptPath;
var jQueryVersions = ['1.7', '1.6.4', '1.6.3', '1.6.2', '1.6.1', '1.6', '1.5.2', '1.5.1', '1.5'];
var development = decodeURI((new RegExp('environment' + '=' + '(.+?)(&|$)').exec(location.search) || [null])[1]) === 'development';

if (development) {
  scriptPath = '../src/ninjaui.js';
}
else {
  scriptPath = '../jquery.ninjaui.min.js';
}

QUnit.config.hidepassed = true;
QUnit.config.reorder = true;

$versions(jQueryVersions).load(scriptPath).execute(function ($, jQuery, version) {

  'use strict';

  module('Load with jQuery ' + version);

    test('should load jQuery and Ninja UI', function () {
      expect(2);
      equal($.fn.jquery, version, 'jQuery');
      ok($.ninja(), 'Ninja UI');
    });

    if (development) {
      test('should return Ninja UI version', function () {
        expect(1);
        equal($.ninja().version(), 'development', 'Ninja UI version: development');
      });
    }

  var $examples = $('<div class="ninjaui-examples"><div class="ninjaui-examples-title">jQuery ' + version + ' Examples</div></div>').appendTo('body');

  module('.icon()');

    var icons = ['arrow-down', 'arrow-right', 'camera', 'circle', 'circle-clear', 'circle-minus', 'circle-plus', 'go', 'home', 'mail', 'search', 'star', 'stop', 'triangle', 'warn', ''];
    $.each(icons, function(i, icon) {
      var $icon = $.ninja().icon({
        name: icon
      });

      $examples.append($icon, ' ');

      test('should have icon class', function () {
        expect(1);
        ok($icon.is('.ninja-icon'), '.ninja-icon');
      });

      test('should be accessible', function () {
        expect(2);
        equal($icon.attr('aria-label'), icon, 'aria-label: ' + icon);
        equal($icon.attr('role'), 'img', 'role: img');
//        equal($('title', $icon), icon, 'title: ' + icon);
      });
    });
    $examples.append($.ninja().icon({
      color: 'red',
      name: 'stop'
    }), ' ', $.ninja().icon({
      color: 'yellow',
      name: 'warn'
    }), ' ', $.ninja().icon({
      color: 'green',
      name: 'go'
    }), ' ', $.ninja().icon({
      color: 'cyan'
    }), '<br/>');

  module('.button()');

    var $button = $.ninja().button({
      css: {
        'margin-right': '16px'
      },
      html: '<b>New</b> Button'
    }).appendTo($examples);

    test('should have Ninja UI\'s default class', function () {
      expect(1);
      ok($button.hasClass('ninja'), '.ninja');
    });

    test('should accept css overrides on creation', function () {
      expect(1);
      equal($button.css('margin-right'), '16px', 'making them visible in jQuery\'s .css()');
      // Note that different browsers are not consistent in how they deal with invalid styles.
      // Note also that values given and values returned do not always match, such as 1em returning 16px
    });

    test('should accept html content on creation', function () {
      expect(1);
      $('#qunit-fixture').append($.ninja().button({html: '<b>New</b> Button'}));
      equal($button.html(), '<b>New</b> Button', 'which jQuery can then render');
    });

});
