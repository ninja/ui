/*
  Copyright 2008-2012 Jamie Hoover.
  Licensed per the terms of the Apache License v2.0. See README.md for details.

  Note: No testing for computed styles. HTML DOM/BOM only!
*/

/*jshint bitwise: true, browser: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 2, node: true, maxerr: 3, newcap: true, noarg: true, noempty: true, nomen: true, nonew: true, onevar: true, plusplus: false, regexp: true, strict: false, undef: true, white: true*/

module.exports = function ($, window, document, test, assert) {

  test($, 'button.html', function () {
    var $button = $.ninja.button();

    assert($button.is('button'));
    assert($button.hasClass('nui-btn'));
  });

  test($, 'button.options.html', function () {
    var $button = $.ninja.button({
      html: 'HTML'
    });

    assert.equal($button.html(), 'HTML');
  });

  test($, 'button.options.disable', function () {
    var $button = $.ninja.button({
      disable: true
    });

    assert($button.hasClass('nui-dsb'));
  });

  test($, 'button.options.select', function () {
    var $button = $.ninja.button({
      select: true
    });

    assert($button.hasClass('nui-slc'));
  });

  test($, 'button.states', function () {
    var
      buttonState = '',
      $button = $.ninja.button().deselect(function () {
        buttonState = 'deselected';
      }).disable(function () {
        buttonState = 'disabled';
      }).enable(function () {
        buttonState = 'enabled';
      }).select(function () {
        buttonState = 'selected';
      });

    $button.select();
    assert.equal(buttonState, 'selected');

    $button.deselect();
    assert.equal(buttonState, 'deselected');

    $button.disable();
    assert.equal(buttonState, 'disabled');

    $button.enable();
    assert.equal(buttonState, 'enabled');
  });

};

/*
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
*/
