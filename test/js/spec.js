/*
  Copyright 2008-2011 Jamie Hoover.
  Licensed per the terms of the Apache License v2.0. See Readme.md for details.
*/

/*globals QUnit, $versions, describe, before, after, given, it, assert*/

/*jshint bitwise: true, browser: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 2, jquery: true, maxerr: 3, newcap: true, noarg: true, noempty: true, nomen: true, nonew: true, onevar: true, plusplus: true, regexp: true, strict: true, undef: true, white: true*/

var
  jQueryVersions = ['1.7', '1.6.4', '1.6.3', '1.6.2', '1.6.1', '1.6', '1.5.2', '1.5.1', '1.5', '1.4.4', '1.4.3'],
  environment = decodeURI((new RegExp('environment' + '=' + '(.+?)(&|$)').exec(location.search) || [null])[1]),
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

  var $examples = $('<div class="ninjaui-examples"><div class="ninjaui-examples-title">jQuery ' + version + ' Examples</div></div>').appendTo('body');

  QUnit.specify('<b>Ninja UI</b> ' + environment, function () {
    describe('jQuery ' + version, function () {

      describe('Infrastructure', function () {
        it('should load jQuery ' + version, function () {
          assert($.fn.jquery).equals(version);
        });

        it('should load Ninja UI', function () {
          assert($.ninja).isDefined();
        });

        if (environment !== 'production') {
          it('should return development Ninja UI version if environment is not production', function () {
            assert($.ninja.version()).equals('development');
          });
        }
      });

/* $.ninja.button() */
      describe('$.ninja.button()', function () {
        var $toggleSelect, $toggleDisable,
        $button = $.ninja.button({
          html: 'Button'
        }).disable(function () {
          $toggleSelect.attr({
            disabled: 'disabled'
          });
        }).enable(function () {
          $toggleSelect.attr({
            disabled: false
          });
        }).select(function () {
          $toggleSelect.attr({
            checked: 'checked'
          });
        }).deselect(function () {
          $toggleSelect.attr({
            checked: false
          });
        }),
        $buttonSelected = $.ninja.button({
          css: {
            'margin-right': '16px'
          },
          html: '<i>Selected</i> Button',
          select: true
        }),
        $buttonDisabled = $.ninja.button({
          html: '<i>Disabled</i> Button',
          disable: true
        });

        $toggleSelect = $('<input/>', {
          type: 'checkbox'
        }).change(function () {
          if ($toggleSelect.attr('checked')) {
            $button.select();
          } else {
            $button.deselect();
          }
        });

        $toggleDisable = $('<input/>', {
          type: 'checkbox'
        }).change(function () {
          if ($toggleDisable.attr('checked')) {
            $button.disable();
          } else {
            $button.enable();
          }
        });

        $examples.append($button, ' ', $toggleSelect, 'Select ', $toggleDisable, 'Disable', '<br/><br/>', $buttonSelected, ' ', $buttonDisabled);

        it('should have button class', function () {
          assert($button.hasClass('ninja-object-button')).isTrue();
        });

        it('should accept css overrides on creation', function () {
          assert($buttonSelected.css('margin-right')).equals('16px');
          // Note that different browsers are not consistent in how they deal with invalid styles.
          // Note also that values given and values returned do not always match, such as 1em returning 16px
        });

        it('should accept html content on creation', function () {
          assert($buttonSelected.html()).equals('<i>Selected</i> Button');
        });

        it('should have class of ninja-state-select when select is true', function () {
          assert($buttonSelected.hasClass('ninja-state-select')).isTrue();
        });

        it('should have class of ninja-state-disable when disable is true', function () {
          assert($buttonDisabled.hasClass('ninja-state-disable')).isTrue();
        });
      });
/* */

/* $.ninja.dialog() */
      describe('$.ninja.dialog()', function () {
        var
          $toggleDialog,
          $dialog = $.ninja.dialog({
            html: '<div style="padding: 50px">This is <b>HTML</b> inside the dialog.</div>'
          }).attach(function () {
            $toggleDialog.attr({
              checked: 'checked'
            });
          }).detach(function () {
            $toggleDialog.attr({
              checked: false
            });
          });
        $toggleDialog = $('<input/>', {
          type: 'checkbox'
        }).change(function () {
          if ($toggleDialog.attr('checked')) {
            $dialog.attach();
          } else {
            $dialog.detach();
          }
        });
        $examples.append('<br/><br/>', $toggleDialog, 'Attach Dialog');
      });
/* */

/* $.ninja.drawer() */
      describe('$.ninja.drawer()', function () {

        var $drawer, $drawerSelect;

        $drawer = $.ninja.drawer({
          css: {
            width: '360px'
          },
          html: '<div style="padding: 50px">This is <b>HTML</b> inside the drawer.</div>',
          title: 'Drawer'
        });

        $drawerSelect = $.ninja.drawer({
          css: {
            width: '360px'
          },
          html: '<div style="padding: 50px">This is <b>HTML</b> inside the drawer.</div>',
          select: true,
          title: '<i>Selected</i> Drawer'
        });

        $examples.append('<br/><br/>', $drawer, '<br/>', $drawerSelect);

        it('should have drawer class', function () {
          assert($drawer.hasClass('ninja-object-drawer')).isTrue();
        });

        it('should accept css overrides on creation', function () {
          assert($drawer.css('width')).equals('360px');
          // Note that different browsers are not consistent in how they deal with invalid styles.
          // Note also that values given and values returned do not always match, such as 1em returning 16px
        });

        it('should accept html content on creation', function () {
          assert($drawer.find('.ninja-object-tray').html()).equals('<div style="padding: 50px">This is <b>HTML</b> inside the drawer.</div>');
        });

        it('should have a right arrow before selecting', function () {
          assert($drawer.find('.ninja-object-button .ninja-object-icon').attr('aria-label')).equals('drawer');
        });

        it('should have a down arrow after selecting', function () {
          assert($drawerSelect.find('.ninja-object-button .ninja-object-icon').attr('aria-label')).equals('drawer-select');
        });

      });
/* */

/* $('#object').ninja().hint() */
      describe('$(\'#object\').ninja().hint()', function () {
        var
          $buttonHint = $.ninja.button({
            html: 'Hint'
          }).hint({
            html: '<div>This is <b>HTML</b> inside the hint.</div>'
          });
        $examples.append('<br/>', $buttonHint, '<br/>');
      });
/* */

/* $.ninja.icon() */
      describe('$.ninja.icon()', function () {
        $examples.append('<br/>');

        var iconNames = ['spin', 'stop', 'yield', 'go', 'x', '-', '+', 'camera', 'drawer', 'drawer-select', 'home', 'mail', 'menu', 'search', 'star', 'close'];

        $.each(iconNames, function (i, iconName) {
          var $example, $icon;
          if (iconName === 'stop') {
            $icon = $.ninja.icon({
              css: {
                fill: '#c00',
                margin: '5em',
                stroke: '#c00'
              },
              name: iconName
            });
          } else if (iconName === 'yield') {
            $icon = $.ninja.icon({
              css: {
                fill: 'goldenrod',
                stroke: 'goldenrod'
              },
              name: iconName
            });
          } else if (iconName === 'go') {
            $icon = $.ninja.icon({
              css: {
                fill: 'green',
                stroke: 'green'
              },
              name: iconName
            });
          } else {
            $icon = $.ninja.icon({
              name: iconName
            });
          }
          $example = $('<span/>', {
            'class': 'ninjaui-example-icon'
          });
          $example.append($icon, ' ', iconName);
          $examples.append($example);

          it('should have icon class', function () {
            if ($.inArray(version, ['1.5.2', '1.5.1', '1.5', '1.4.4', '1.4.3']) === -1) {
              // can't test these due to a bug in these jQuery versions
              assert($icon.attr('class')).equals('ninja-object-icon');
            }
          });

          it('should have aria label', function () {
            assert($icon.attr('aria-label')).equals(iconName);
          });

          it('should have image role', function () {
            assert($icon.attr('role')).equals('img');
          });

          it('should have icon title', function () {
            assert($('title', $icon).text()).equals(iconName);
          });

          it('should accept css overrides on creation', function () {
            if (iconName === 'stop') {
              assert($icon.find('g').attr('style')).equals('fill: #cc0000; margin-top: 5em; margin-right: 5em; margin-bottom: 5em; margin-left: 5em; stroke: #cc0000; ');
            } else if (iconName === 'warn') {
              assert($icon.find('g').attr('style')).equals('fill: #daa520; stroke: #daa520; ');
            } else if (iconName === 'go') {
              assert($icon.find('g').attr('style')).equals('fill: #008000; stroke: #008000; ');
            }
          });
        });

      });
/* */

/* $.ninja.menu() */
      describe('$.ninja.menu()', function () {
        var
          $message = $('<span/>'),
          please = function () {
            $message.html(':( Try again.');
          },
          $menu = $.ninja.menu({
            choices: [
              {
                html: '<div>Mo</div>',
                select: function () {
                  $message.html('Oh, a wise guy eh?');
                }
              },
              {
                html: '<div>Larry</div>',
                select: function () {
                  $message.html('Cut it out, ya puddinhead!');
                }
              },
              {
                html: '<div>Curly</div>',
                select: function () {
                  $message.html('Hey, Mo!');
                }
              },
              { spacer: true },
              {
                html: '<div>Shemp</div>',
                select: function () {
                  please();
                }
              },
              {
                html: '<div>Joe</div>',
                select: function () {
                  please();
                }
              },
              {
                html: '<div>Curly Joe</div>',
                select: function () {
                  please();
                }
              }
            ],
            html: 'Menu'
          });

        $examples.append('<br/><br/>', $menu, ' ', $message);
      });
/* */

/* $.ninja.tabs() */
      describe('$.ninja.tabs()', function () {
        var
          $message = $('<span/>'),
          poorly = function () {
            $message.html('You have chosen... poorly.');
          },
          $tabs = $.ninja.tabs({
            choices: [
              {
                html: '<div><i>Gold</i> Tab</div>',
                select: function () {
                  poorly();
                }
              },
              {
                html: '<div><i>Silver</i> Tab</div>',
                select: function () {
                  poorly();
                }
              },
              {
                html: '<div><i>Wood</i> Tab</div>',
                select: function () {
                  $message.html('You have chosen... wisely.');
                }
              }
            ]
          });

        $examples.append('<br/><br/>', $tabs, ' ', $message);
      });
/* */

    });
  });
});
