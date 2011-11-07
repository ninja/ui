/*
  Copyright 2008-2011 Jamie Hoover.
  Licensed per the terms of the Apache License v2.0. See Readme.md for details.
*/

/*globals
  QUnit, $versions, describe, before, after, given, it, assert
*/

/*jshint
  bitwise: true, browser: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 2, jquery: true, newcap: true, noarg: true, noempty: true, nomen: true, nonew: true, regexp: true, strict: true, undef: true, white: false
*/

var jQueryVersions = ['1.7', '1.6.4', '1.6.3', '1.6.2', '1.6.1', '1.6', '1.5.2', '1.5.1', '1.5'];
var environment = decodeURI((new RegExp('environment' + '=' + '(.+?)(&|$)').exec(location.search) || [null])[1]);
var scriptPath;

if (environment === 'production') {
  scriptPath = '../jquery.ninjaui.min.js';
}
else {
  environment = 'development';
  jQueryVersions = jQueryVersions[0];
  scriptPath = '../src/ninjaui.js';
}

QUnit.config.hidepassed = true;
QUnit.config.reorder = true;
QUnit.specify.globalApi = true;

$versions(jQueryVersions).load(scriptPath).execute(function($, jQuery, version) {
  'use strict';

  var $examples = $('<div class="ninjaui-examples"><div class="ninjaui-examples-title">jQuery ' + version + ' Examples</div></div>').appendTo('body');

  QUnit.specify('Ninja UI (' + environment + ')', function() {
    describe('On jQuery ' + version, function() {

      describe('Infrastructure', function() {
        it('should load jQuery ' + version, function() {
          assert($.fn.jquery).equals(version);
        });

        it('should load Ninja UI', function() {
          assert($.ninja()).isDefined();
        });

        if (environment !== 'production') {
          it('should return development Ninja UI version if environment is not production', function() {
            assert($.ninja().version()).equals('development');
          });
        }
      });

      describe('.icon()', function() {
        var iconNames = ['spin', 'arrow-down', 'arrow-right', 'camera', 'circle', 'circle-clear', 'circle-minus', 'circle-plus', 'home', 'mail', 'search', 'star', 'triangle', 'stop', 'warn', 'go'];

        $.each(iconNames, function(i, iconName) {
          var $icon;
          if (iconName === 'stop') {
            $icon = $.ninja().icon({
              color: '#c00',
              name: iconName
            });
          } else if (iconName === 'warn') {
            $icon = $.ninja().icon({
              color: 'goldenrod',
              name: iconName
            });
          } else if (iconName === 'go') {
            $icon = $.ninja().icon({
              color: 'green',
              name: iconName
            });
          } else {
            $icon = $.ninja().icon({
              name: iconName
            });
          }
          $examples.append($icon, ' ');

          it('should have icon class', function() {
            if (version === '1.5.2' || version === '1.5.1' || version === '1.5') {
              // can't test these due to a bug in these jQuery versions
            } else {
              assert($icon.attr('class')).equals('ninja-icon');
            }
          });

          it('should have aria label', function() {
            assert($icon.attr('aria-label')).equals(iconName);
          });

          it('should have image role', function() {
            assert($icon.attr('role')).equals('img');
          });

          it('should have icon title', function() {
            assert($('title', $icon).text()).equals(iconName);
          });
        });

        $examples.append('<br/>');

      });

      describe('.button()', function() {
        var $button = $.ninja().button({
          css: {
            'margin-right': '16px'
          },
          html: '<i>New</i> Button'
        }).appendTo($examples);

        var $buttonSelected = $.ninja().button({
          html: '<i>Selected</i> Button',
          select: true
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
          assert($button.html()).equals('<i>New</i> Button');
        });
      });


    });
  });
});
