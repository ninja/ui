/*globals
  QUnit, $versions, describe, before, after, given, it, assert
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
QUnit.specify.globalApi = true;

$versions(jQueryVersions).load(scriptPath).execute(function($, jQuery, version) {
  'use strict';

  var $examples = $('<div class="ninjaui-examples"><div class="ninjaui-examples-title">jQuery ' + version + ' Examples</div></div>').appendTo('body');

  QUnit.specify('Ninja UI', function() {
    describe('On jQuery ' + version, function() {

      describe('Infrastructure', function() {
        it('should load jQuery ' + version, function() {
          assert($.fn.jquery).equals(version);
        });

        it('should load Ninja UI', function() {
          assert($.ninja()).isDefined();
        });

        if (development) {
          it('should return development Ninja UI version if in development mode', function() {
            assert($.ninja().version()).equals('development');
          });
        }
      });

      describe('.icon()', function() {
        var icons = ['', 'arrow-down', 'arrow-right', 'camera', 'circle', 'circle-clear', 'circle-minus', 'circle-plus', 'go', 'home', 'mail', 'search', 'star', 'stop', 'triangle', 'warn'];

        $.each(icons, function(i, icon) {
          var $icon = $.ninja().icon({
            name: icon
          });

          $examples.append($icon, ' ');
        });

        $examples.append($.ninja().icon({
          color: '#c00',
          name: 'stop'
        }), ' ', $.ninja().icon({
          color: 'goldenrod',
          name: 'warn'
        }), ' ', $.ninja().icon({
          color: 'green',
          name: 'go'
        }), '<br/>');

        given(icons).
        it('should have icon class', function(iconName) {
          assert($.ninja().icon({name: iconName}).is('.ninja-icon')).isTrue();
        });

        given(icons).
        it('should have aria label', function(iconName) {
          assert($.ninja().icon({name: iconName}).attr('aria-label')).equals(iconName);
        });

        given(icons).
        it('should have image role', function(iconName) {
          assert($.ninja().icon({name: iconName}).attr('role')).equals('img');
        });

        given(icons).it('should have icon title', function(iconName) {
          assert($('title', $.ninja().icon({name: iconName})).text()).equals(iconName);
        });
      });

      describe('.button()', function() {
        var $button = $.ninja().button({
          css: {
            'margin-right': '16px'
          },
          html: '<b>New</b> Button'
        }).appendTo($examples);

        it('should have Ninja UI\'s default class', function() {
          assert($button.hasClass('ninja')).isTrue();
        });

        it('should accept css overrides on creation', function() {
          assert($button.css('margin-right')).equals('16px');
          // Note that different browsers are not consistent in how they deal with invalid styles.
          // Note also that values given and values returned do not always match, such as 1em returning 16px
        });

        it('should accept html content on creation', function() {
          $('#qunit-fixture').append($.ninja().button({html: '<b>New</b> Button'}));

          assert($button.html()).equals('<b>New</b> Button');
        });
      });

      
    });
  });
});
