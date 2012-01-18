/*
  Copyright 2008-2012 Jamie Hoover.
  Licensed per the terms of the Apache License v2.0. See README.md for details.
*/

/*jshint bitwise: true, browser: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 2, jquery: true, maxerr: 3, newcap: true, noarg: true, noempty: true, nomen: true, nonew: true, onevar: true, plusplus: true, regexp: true, strict: true, undef: true, white: true*/

/*globals QUnit, $versions, describe, before, after, given, it, assert, async*/

var
  jQueryVersions = ['1.7.1', '1.7', '1.6.4', '1.6.3', '1.6.2', '1.6.1', '1.6'],
  environment = decodeURI((new RegExp('environment' + '=' + '(.+?)(&|$)').exec(location.search) || [null])[1]),
  theme = decodeURI((new RegExp('theme' + '=' + '(.+?)(&|$)').exec(location.search) || [null])[1]),
  scriptPath;

if (environment === 'production') {
  scriptPath = '../jquery.ninjaui.min.js';
} else {
  environment = 'development';
  jQueryVersions = jQueryVersions[0];
  scriptPath = '../src/ninjaui.js';
}

QUnit.config.hidepassed = true;
QUnit.config.reorder = true;
QUnit.specify.globalApi = true;

$versions(jQueryVersions).load(scriptPath).execute(function ($, jQuery, version) {

  'use strict';

  if ($.inArray(theme, ['bitmap', 'yugen']) > -1) {
    $('<link/>', {
      rel: 'stylesheet',
      href: '../themes/' + theme + '.css'
    }).appendTo('head');
    $('body').addClass('nui-thm-' + theme);
  }

  var
    svg,
    svgInline,
    svgInlineMaskMissing,
    svgNamespace = 'http://www.w3.org/2000/svg',
    $test = $('<div>').appendTo('body'),
    $samples = $('<div class="nui-grd ninjaui-samples"><div class="ninjaui-samples-title">jQuery ' + version + ' Samples (' + environment + ')</div></div>').appendTo('body'),
    $sample = $('<div class="ninjaui-sample">');

  $test.html('<svg>');
  svgInline = ($test.find('svg')[0] && $test.find('svg')[0].namespaceURI) === svgNamespace;
  if (svgInline) {
    svg = true;
    if ($.browser.safari) {
      svgInlineMaskMissing = $.browser.version < 535;
    }
  } else {
    svg = !!document.createElementNS && !!document.createElementNS(svgNamespace, 'svg').createSVGRect;
  }
  $test.remove();

  QUnit.specify('Ninja UI', function () {

    describe('jQuery ' + version, function () {

      it('should load', function () {
        assert($).isDefined();
      });

      it('should be correct version', function () {
        assert($.fn.jquery).equals(version);
      });

      describe('Ninja UI', function () {

        // Note that styles set and get do not always match (1em returns 16px) and browsers handle invalid styles inconsitently

        it('should load', function () {
          assert($.ninja).isDefined();
        });

        if (environment !== 'production') {
          it('should be development version', function () {
            assert($.ninja.version()).equals('development');
          });
        }

        describe('Icon', function () {

          var
            $icons,
            iconNames = ['-', '+', 'arrow-down', 'arrow-right', 'camera', 'email', 'go', 'home', 'search', 'spin', 'star', 'stop', 'x', 'X', 'yield'];

          $icons = $sample
            .clone()
            .append($icons)
            .appendTo($samples);

          given(iconNames).it('should have correct HTML', function (iconName) {
            iconName = iconName.toString();
            var
              mask = $.inArray(iconName, ['-', '+', 'camera', 'x']) > -1,
              $icon = $.ninja.icon({
                value: iconName
              }).appendTo($icons);
            assert($icon).isDefined();
            if (svgInline && (!mask || mask && !svgInlineMaskMissing)) {
              assert($icon.is('svg')).isTrue();
            } else if (svg) {
              assert($icon.is('img')).isTrue();
            } else {
              assert($icon.is('span')).isTrue();
            }
            assert($icon.attr('class')).equals('nui-icn');
            assert($icon.attr('aria-label')).equals(iconName);
          });

        });

        describe('Button', function () {

          var $button, $buttonCSS, $buttonDisable, $buttonIcon, $buttonSelect, $buttonState;

          $button = $.ninja.button({
            html: 'Button'
          }).disable(function () {
            $buttonState = 'disabled';
          }).enable(function () {
            $buttonState = 'enabled';
          }).select(function () {
            $buttonState = 'selected';
          }).deselect(function () {
            $buttonState = 'deselected';
          });

          $buttonCSS = $.ninja.button({
            css: {
              'font-weight': '900'
            },
            html: 'CSS'
          });

          $buttonDisable = $.ninja.button({
            html: 'Disabled',
            disable: true
          });

          $buttonIcon = $.ninja.button({
            html: $.ninja.icon({
              name: 'home'
            }),
            select: true
          });

          $buttonSelect = $.ninja.button({
            html: 'Selected',
            select: true
          });

          $sample
            .clone()
            .append($button, $buttonCSS, $buttonDisable, $buttonSelect)
            .appendTo($samples);
          $buttonIcon = $button.find('.nui-icn');

          it('should have correct HTML', function () {
            assert($button).isDefined();
            assert($button.is('button')).isTrue();
            assert($button.hasClass('nui-btn')).isTrue();
          });

          it('should have correct CSS', function () {
            assert($button.css('text-align')).equals('center');
          });

          it('should accept css overrides on creation', function () {
            assert($buttonCSS.css('font-weight')).equals('900');
          });

          it('should accept html content on creation', function () {
            assert($buttonSelect.html()).equals('Selected');
          });

          it('should have correct initial state', function () {
            assert($buttonDisable.hasClass('nui-dsb')).isTrue();
            assert($buttonSelect.hasClass('nui-slc')).isTrue();
          });
        });

        describe('Autocomplete', function () {

          var $autocomplete, $autocompleteInput, $autocompleteSpin;

          $autocomplete = $.ninja.autocomplete({
            placeholder: 'Autocomplete'
          }).values(function (event) {
            $autocomplete.list({
              values: [
                { html: 'qwertyuiop' },
                { html: 'asdfghjkl' },
                { html: 'zxcvbnm' }
              ],
              query: event.query
            });
          });

          $autocompleteInput = $autocomplete.find('input');

          $autocompleteSpin = $autocomplete.find('.nui-icn[aria-label=spin]');

          $sample
            .clone()
            .append($autocomplete)
            .appendTo($samples);

          it('should have correct HTML', function () {
            assert($autocomplete).isDefined();
            assert($autocomplete.is('span')).isTrue();
            assert($autocomplete.hasClass('nui-atc')).isTrue();
            assert($autocompleteInput).isDefined();
            assert($autocompleteInput.attr('type')).equals('text');
            assert($autocompleteSpin).isDefined();
          });

          it('should have correct CSS', function () {
            assert($autocomplete.css('display')).equals('inline-block');
            assert($autocomplete.css('position')).equals('relative');
            assert($autocompleteInput.css('padding-right')).equals('17px');
          });

          it('should have placeholder', function () {
            assert($autocompleteInput.val() || $autocompleteInput.attr('placeholder')).equals('Autocomplete');
          });

        });

        describe('Dialog', function () {

          var $dialog, $dialogState;

          $dialog = $.ninja.dialog({
            html: 'HTML'
          }).attach(function () {
            $dialogState = 'attached';
          }).detach(function () {
            $dialogState = 'detached';
          });

          before(function () {
            $dialog.attach();
          });

          after(function () {
            $dialog.detach();
          });

          it('should attach', function () {
            assert($dialogState).equals('attached');
          });

          it('should have correct HTML', function () {
            assert($dialog).isDefined();
            assert($dialog.is('span')).isTrue();
          });

        });

        describe('Drawer', function () {

          var $drawer, $drawerHandle, $drawerIconArrowRight, $drawerSelect, $drawerSelectHandle, $drawerSelectIconArrowDown, $drawerTray;

          $drawer = $.ninja.drawer({
            css: {
              fontWeight: '900'
            },
            html: 'HTML',
            value: 'Drawer'
          });

          $drawerSelect = $.ninja.drawer({
            html: 'HTML',
            select: true,
            value: 'Selected'
          });

          $sample
            .clone()
            .append($drawer, $drawerSelect)
            .appendTo($samples);

          $drawerHandle = $drawer.find('button.nui-btn::first-child');

          $drawerIconArrowRight = $drawerHandle.find('.nui-icn[aria-label="arrow-right"]');

          $drawerSelectHandle = $drawerSelect.find('button.nui-btn::first-child');

          $drawerSelectIconArrowDown = $drawerSelectHandle.find('.nui-icn[aria-label="arrow-down"]');

          $drawerTray = $drawer.find('.nui-try');

          it('should have correct HTML', function () {
            assert($drawer).isDefined();
            assert($drawer.is('div')).isTrue();
            assert($drawer.hasClass('nui-drw')).isTrue();
          });

          it('should accept css overrides on creation', function () {
            assert($drawerHandle.css('font-weight')).equals('900');
          });

          it('should accept html content on creation', function () {
            assert($drawerTray.html()).equals('HTML');
          });

          if (svgInline) {
            it('should have a right arrow before selecting', function () {
              assert($drawerIconArrowRight.is(':visible')).isTrue();
            });

            it('should have a down arrow after selecting', function () {
              assert($drawerSelectIconArrowDown.is(':visible')).isTrue();
            });
          }

        });

        describe('Menu', function () {

          var $menu, menuHTML;

          $menu = $.ninja.menu({
            html: 'Menu',
            values: [
              {
                html: '<div>A</div>',
                select: function () {
                  menuHTML = 'A';
                }
              },
              {
                html: '<div>B</div>',
                select: function () {
                  menuHTML = 'B';
                }
              },
              { rule: true },
              {
                html: '<div>C</div>',
                select: function () {
                  menuHTML = 'C';
                }
              }
            ]
          });

          $sample
            .clone()
            .append($menu)
            .appendTo($samples);

          it('should have correct HTML', function () {
            assert($menu).isDefined();
            assert($menu.is('span')).isTrue();
            assert($menu.hasClass('nui-mnu')).isTrue();
          });

        });

        describe('Rating', function () {

          var $rating, ratingStars;

          $rating = $.ninja.rating({
            average: 3
          }).select(function (event) {
            ratingStars = event.value;
          });

          $sample
            .clone()
            .append($rating)
            .appendTo($samples);

          it('should have correct HTML', function () {
            assert($rating).isDefined();
            assert($rating.is('span')).isTrue();
            assert($rating.hasClass('nui-rtn')).isTrue();
          });

        });

        describe('Slider', function () {

          var $slider, sliderValue;

          $slider = $.ninja.slider({
            html: 'Slider',
            value: 1,
            values: [
              {
                html: 'A',
                select: function (event) {

                }
              },
              { html: 'B' },
              { html: 'C' }
            ]
          });

          $sample
            .clone()
            .append($slider)
            .appendTo($samples);

          it('should have correct HTML', function () {
            assert($slider).isDefined();
            assert($slider.is('span')).isTrue();
            assert($slider.hasClass('nui-sld')).isTrue();
          });

        });

        describe('Tabs', function () {

          var $tabs, tabCurrent;

          $tabs = $.ninja.tabs({
            values: [
              {
                html: 'A',
                select: function () {
                  tabCurrent = 'a';
                }
              },
              {
                html: 'B',
                select: function () {
                  tabCurrent = 'b';
                }
              },
              {
                html: 'C',
                select: function () {
                  tabCurrent = 'c';
                }
              }
            ]
          });

          $sample
            .clone()
            .append($tabs)
            .appendTo($samples);

          it('should have correct HTML', function () {
            assert($tabs).isDefined();
            assert($tabs.is('span')).isTrue();
            assert($tabs.hasClass('nui-tab-hrz')).isTrue();
          });

        });
      });

    });
  });
});
