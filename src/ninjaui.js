/*
  Ninja UI jQuery Plugin development
  http://ninjaui.com/
  Copyright 2008-2011 Jamie Hoover
  Licensed per the terms of the Apache License v2.0
  https://github.com/ninja/ui/blob/master/README.md for details
*/

/*globals CFInstall: false*/

/*jshint bitwise: true, browser: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 2, jquery: true, maxerr: 3, newcap: true, noarg: true, noempty: true, nomen: true, nonew: true, onevar: true, plusplus: false, regexp: true, strict: true, undef: true, white: true*/

(function ($, window, document, undefined) {

  'use strict';

  var
    browser = $.browser,
    defaults,
    objects,
    methods,
    time,
    version = $.fn.jquery.split('.'),
    versionMinor = parseFloat(version[1]),
    versionIncrement = parseFloat(version[2] || '0');

  if (versionMinor === 4 && versionIncrement < 3 || versionMinor < 4) {
    $.error('Ninja UI requires jQuery 1.4.3 or higher.');
  }

  if (browser.msie && parseFloat(browser.version) < '9') {
    $('<script/>', {
      defer: '',
      src: 'http://ajax.googleapis.com/ajax/libs/chrome-frame/1.0.3/CFInstall.min.js'
    }).appendTo('head');
    $(document).ready(function () {
      CFInstall.check({
        mode: 'overlay'
      });
    });
  }

  $('<link/>', {
    rel: 'stylesheet',
    href: '../src/ninjaui.css'
  }).appendTo('head');

  time = $.now();

  function uniqueId() {
    return time ++;
  }

  methods = {

    attach: function (callback) {
      return this.each(function () {
        var $object = $(this).ninja();
        if ($.isFunction(callback)) {
          $object.bind('attach.ninja', callback);
        } else {
          $object.trigger('attach.ninja');
        }
      });
    },

    change: function (callback) {
      return this.each(function () {
        var $object = $(this).ninja();
        if ($.isFunction(callback)) {
          $object.bind('change.ninja', callback);
        } else {
          $object.trigger('change.ninja');
        }
      });
    },

    deselect: function (callback) {
      return this.each(function () {
        var $object = $(this).ninja();
        if ($.isFunction(callback)) {
          $object.bind('deselect.ninja', callback);
        } else if ($object.is('.ninja-state-select') && !$object.is('.ninja-state-disable')) {
          $object.trigger('deselect.ninja');
        }
      });
    },

    detach: function (callback) {
      return this.each(function () {
        var $object = $(this).ninja();
        if ($.isFunction(callback)) {
          $object.bind('detach.ninja', callback);
        } else {
          $object.trigger('detach.ninja');
          $.fn.detach.apply($object);
        }
      });
    },

    disable: function (callback) {
      return this.each(function () {
        var $object = $(this).ninja();
        if ($.isFunction(callback)) {
          $object.bind('disable.ninja', callback);
        } else {
          $object.fadeTo('fast', 0.5).addClass('ninja-state-disable').trigger('disable.ninja');
        }
      });
    },

    enable: function (callback) {
      return this.each(function () {
        var $object = $(this).ninja();
        if ($.isFunction(callback)) {
          $object.bind('enable.ninja', callback);
        } else {
          $object.fadeTo('fast', 1).removeClass('ninja-state-disable').trigger('enable.ninja');
        }
      });
    },

    hint: function (options) {
      return this.each(function () {
        options = $.extend({}, defaults, options);
        var
          $object = $(this),
          $popup = $('<span/>', {
            'class': 'ninja-object-popup',
            css: $.extend(options.css, {
              minWidth: $object.width()
            }),
            html: options.html
          }),
          $stem = $('<svg class="ninja-object-stem" height="1" width="1" version="1.1" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg"><g><polygon points="4,1 8,8 1,8" stroke-width="0"/><line x1="4" x2="0" y2="8"/><line x1="4" x2="8" y2="8"/></g></svg>').appendTo($popup);
        if (options.css) {
          $stem.find('g').css(options.css);
        }
        $object.bind({
          'deselect.ninja mouseenter.ninja': function () {
            $popup.css({
              top: $object.outerHeight() + 5
            }).appendTo($object);
            if ($object.offset().left + $popup.outerWidth() > $(window).width()) {
              $popup.css({
                right: 0
              });
              $stem.css({
                right: ($object.outerWidth() / 2) - 4
              });
            } else {
              $popup.css({
                left: ($object.outerWidth() - $popup.outerWidth()) / 2
              });
              $stem.css({
                left: ($popup.outerWidth() / 2) - 4
              });
            }
          },
          'mouseleave.ninja select.ninja': function () {
            $popup.detach();
          }
        });
      });
    },

    select: function (event) {
      return this.each(function () {
        var $object = $(this).ninja();
        if ($.isFunction(event)) {
          $object.bind('select.ninja', event);
        } else if (!$object.is('.ninja-state-disable')) {
          $object.trigger('select.ninja');
        }
      });
    }

  };

  objects = {

    button: function (options) {
      options = $.extend({}, defaults, options);
      var $button = $('<button/>', {
        'class': 'ninja-object-button',
        css: options.css,
        html: options.html
      });
      $button.bind({
        'click.ninja': function () {
          if (!$button.is('.ninja-state-disable')) {
            if ($button.is('.ninja-state-select')) {
              $button.trigger('deselect.ninja');
            } else {
              $button.trigger('select.ninja');
            }
          }
        },
        'deselect.ninja': function () {
          $button.removeClass('ninja-state-select');
        },
        'disable.ninja': function () {
          $button.attr({
            disabled: 'disabled'
          });
        },
        'enable.ninja': function () {
          $button.attr({
            disabled: false
          });
        },
        'select.ninja': function () {
          $button.addClass('ninja-state-select');
        }
      });
      if (options.select) {
        $button.trigger('select.ninja');
      }
      if (options.disable) {
        $button.ninja().disable();
      }
      return $button.ninja();
    },

    dialog: function (options) {
      options = $.extend({}, defaults, {
        $parent: $('body')
      }, options);
      var
        $popup = $('<span/>', {
          'class': 'ninja-object-popup',
          css: options.css,
          html: options.html
        }),
        $button = $.ninja.icon({
          name: 'close'
        }).bind('click.ninja', function () {
          $popup.detach();
        }).appendTo($popup),
        $blocker = $('<div/>', {
          'class': 'ninja-object-blocker'
        }).bind('click.ninja', function (event) {
          if ($.inArray($popup[0], $(event.target).parents()) === -1) {
            $popup.detach();
          }
        });
      $popup.bind({
        'attach.ninja': function (event) {
          options.$parent.append($blocker, $popup);
          $blocker.height(options.$parent.height());
          $popup.css({
            left: ($(window).width() / 2) - ($popup.width() / 2),
            top: ($(window).height() / 2) - ($popup.height() / 2) + $(window).scrollTop()
          });
          $(document).bind({
            'keyup.ninja': function (event) {
              if (event.keyCode === 27) {/* escape */
                $popup.detach();
              }
            }
          });
        },
        'detach.ninja remove.ninja': function () {
          $(document).unbind('click.ninja keydown.ninja');
          $blocker.detach();
        }
      });
      return $popup.ninja();
    },

    drawer: function (options) {
      options = $.extend({}, defaults, options);
      var
        $drawer = $('<div/>', {
          'class': 'ninja-object-drawer',
          css: options.css
        }),
        $tray = $('<div/>', {
          'class': 'ninja-object-tray',
          html: options.html
        }).appendTo($drawer),
        $arrowDown = $.ninja.icon({
          name: 'drawer-select'
        }),
        $arrowRight = $.ninja.icon({
          name: 'drawer'
        }),
        $handle = $.ninja.button($.extend({}, options, {
          select: options.select,
          html: options.title
        })).bind({
          'deselect.ninja': function () {
            $tray.slideUp('fast', function () {
              $arrowDown.detach();
              $handle.prepend($arrowRight);
            });
          },
          'select.ninja': function () {
            $arrowRight.detach();
            $handle.prepend($arrowDown);
            $tray.slideDown('fast');
          }
        }).prependTo($drawer);
      if (options.select) {
        $handle.prepend($arrowDown);
      } else {
        $handle.prepend($arrowRight);
        $tray.hide();
      }
      return $drawer.ninja();
    },

    icon: function (options) {
      options = $.extend({}, defaults, {
        name: 'spin'
      }, options);
      var
        $icon,
        border = ' fill="none" stroke-width="2"',
        defs = '',
        g = '',
        id = uniqueId(),
        idMask = id + 'Mask',
        idSymbol = id + 'Symbol',
        idVector = id + 'Vector',
        mask = '',
        maskBackground = '<rect fill="#fff" x="0" y="0" width="16" height="16"/>',
        onload = '',
        points = '',
        rotate = '';
      if ($.inArray(options.name, ['drawer', 'drawer-select']) > -1) {
        if (options.name === 'drawer-select') {
          points = '4,4 12,4 8,12';
        } else {
          points = '4,4 12,8 4,12';
        }
        g = '<polygon points="' + points + '"/>';
      } else if (options.name === 'camera') {
        defs = '<defs><mask id="' + idMask + '">' + maskBackground + '<circle cx="8" cy="9" r="5"/></mask></defs>';
        g = '<rect x="0" y="4" width="16" height="11" rx="2" ry="2" mask="url(#' + idMask + ')"/><polygon points="4,8 4,4 6,1 10,1 12,4 12,8" mask="url(#' + idMask + ')"/><circle cx="8" cy="9" r="3"/>';
      } else if ($.inArray(options.name, ['x', '-', '+']) > -1) {
        if (options.name === '-') {
          mask = '<rect x="4" y="7" width="8" height="2"/>';
        } else {
          if (options.name !== '+') {
            rotate = ' transform="rotate(45 8 8)"';
          }
          mask = '<polygon points="7,4 9,4 9,7 12,7 12,9 9,9 9,12 7,12 7,9 4,9 4,7 7,7"' + rotate + '/>';
        }
        defs = '<defs><mask id="' + idMask + '">' + maskBackground + mask + '</mask></defs>';
        g = '<circle cx="8" cy="8" mask="url(#' + idMask + ')" r="8"/>';
      } else if (options.name === 'close') {
        defs = '<defs><linearGradient id="g" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#fff;stop-opacity:0.2"/><stop offset="100%" style="stop-color:#000;stop-opacity:0.1"/></linearGradient></defs>';
        g = '<circle cx="8" cy="8" r="7" stroke-width="1"/><circle cx="8" cy="8" r="7" fill="url(#g)"/><polygon class="ninja-object-icon-symbol" points="7,5 9,5 9,7 11,7 11,9 9,9 9,11 7,11 7,9 5,9 5,7 7,7" transform="rotate(45 8 8)"/>';
      } else if (options.name === 'go') {
        g = '<circle' + border + ' cx="8" cy="8" r="7"/><circle cx="8" cy="8" r="5"/>';
      } else if (options.name === 'home') {
        g = '<polygon points="0,10 0,8 8,0 16,8 16,10 14,10 14,16 10,16 10,10 6,10 6,16 2,16 2,10"/><rect x="11" y="16" width="4" height="8"/>';
      } else if (options.name === 'mail') {
        g = '<polygon points="0,2 8,10 16,2"/><polygon points="16,4 12,8 16,12"/><polygon points="0,14 5,9 8,12 11,9 16,14"/><polygon points="0,4 4,8 0,12"/>';
      } else if (options.name === 'menu') {
        g = '<polygon points="5,7 8,2 11,7"/><polygon points="5,9 8,14 11,9"/>';
      } else if (options.name === 'search') {
        g = '<circle' + border + ' cx="7" cy="7" r="5"/><polygon points="9,11 11,9 16,14 14,16"/>';
      } else if (options.name === 'star') {
        g = '<polygon points="0,6 6,6 8,0 10,6 16,6 11,10 13,16 8,12 3,16 5,10"/>';
      } else if (options.name === 'stop') {
        g = '<polygon' + border + ' points="1,11 1,5 5,1 11,1 15,5 15,11 11,15 5,15"/><polygon points="3,10 3,6 6,3 10,3 13,6 13,10 10,13 6,13"/>';
      } else if (options.name === 'yield') {
        g = '<polygon' + border + ' points="8,1 15,15 1,15"/><polygon points="8,5 12,13 4,13"/>';
      } else if (options.name === 'spin') {
        onload = ' onload="var frame=0;setInterval(function(){frame=frame+30;if(frame===360){frame=0}document.getElementById(\'' + idVector + '\').setAttributeNS(null,\'transform\',\'rotate(\'+frame+\' 8 8)\');},100)"';
        defs = '<defs><rect id="' + idSymbol + '" x="7" width="2" height="4"/></defs>';
        g = '<use xlink:href="#' + idSymbol + '" style="opacity:.1" transform="rotate(30 8 8)"/><use xlink:href="#' + idSymbol + '" style="opacity:.2" transform="rotate(60 8 8)"/><use xlink:href="#' + idSymbol + '" style="opacity:.3" transform="rotate(90 8 8)"/><use xlink:href="#' + idSymbol + '" style="opacity:.4" transform="rotate(120 8 8)"/><use xlink:href="#' + idSymbol + '" style="opacity:.5" transform="rotate(150 8 8)"/><use xlink:href="#' + idSymbol + '" style="opacity:.6" transform="rotate(180 8 8)"/><use xlink:href="#' + idSymbol + '" style="opacity:.7" transform="rotate(210 8 8)"/><use xlink:href="#' + idSymbol + '" style="opacity:.8" transform="rotate(240 8 8)"/><use xlink:href="#' + idSymbol + '" style="opacity:.9" transform="rotate(270 8 8)"/><use xlink:href="#' + idSymbol + '" style="opacity:.9.5" transform="rotate(300 8 8)"/><use xlink:href="#' + idSymbol + '" style="opacity:.9.75" transform="rotate(330 8 8)"/><use xlink:href="#' + idSymbol + '"/>';
      }
      $icon = $('<svg aria-label="' + options.name + '" class="ninja-object-icon" height="1" width="1"' + onload + ' role="img" version="1.1" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><title>' + options.name + '</title>' + defs + '<g id="' + idVector + '" stroke-width="0">' + g + '</g></svg>');
      if (options.css) {
        $icon.find('g').css(options.css);
      }
      return $icon;
    },

    menu: function (options) {
      options = $.extend({}, defaults, options);
      var
        $hover,
        $menu = $('<div/>', {
          'class': 'ninja-object-menu'
        }),
        $popup = $('<div/>', {
          'class': 'ninja-object-popup'
        }),
        $button = $.ninja.button($.extend({}, options, {
          html: options.html,
          select: options.select
        })).append($.ninja.icon({
          name: 'menu'
        })).select(function () {
          $hover = null;
          $menu.append($popup).deselect(function () {
            $popup.detach();
          });
          var
            offset = $popup.offset(),
            scrollTop = $(window).scrollTop();
          if ((offset.top + $popup.outerHeight()) > (scrollTop + $(window).height())) {
            $popup.css({
              bottom: $button.outerHeight()
            });
          }
          if ((offset.left + $popup.outerWidth()) > (scrollTop + $(window).width())) {
            $popup.css({
              right: 0
            });
          }
          $(document).bind({
            'keydown.ninja': function (event) {
              $button.blur();
              if ($.inArray(event.keyCode, [38, 40]) > -1) {/* down or up */
                return false;/* prevents page scrolling via the arrow keys when a list is active */
              }
            },
            'keyup.ninja': function (event) {
              if ($.inArray(event.keyCode, [13, 27, 38, 40]) > -1) {/* return, escape, down or up */
                if (event.keyCode === 13) {/* return */
                  if ($hover) {
                    $hover.trigger('click.ninja');
                  }
                } else if (event.keyCode === 40) {/* down arrow */
                  if ($hover) {
                    if ($hover.nextAll('.ninja-object-item').length) {
                      $hover.nextAll('.ninja-object-item:first').trigger('mouseenter.ninja');
                    } else {
                      $popup.find('.ninja-object-item:first').trigger('mouseenter.ninja');
                    }
                  } else {
                    $popup.find('.ninja-object-item:first').trigger('mouseenter.ninja');
                  }
                } else if (event.keyCode === 38) {/* up arrow */
                  if ($hover) {
                    if ($hover.prevAll('.ninja-object-item').length) {
                      $hover.prevAll('.ninja-object-item:first').trigger('mouseenter.ninja');
                    } else {
                      $popup.find('.ninja-object-item:last').trigger('mouseenter.ninja');
                    }
                  } else {
                    $popup.find('.ninja-object-item:last').trigger('mouseenter.ninja');
                  }
                } else if (event.keyCode === 27) {/* escape */
                  $button.trigger('deselect.ninja');
                }
                return false;
              }
            },
            'click.ninja': function (event) {
              if ($.inArray($menu[0], $(event.target).parents()) === -1) {
                $button.trigger('deselect.ninja');
              }
            }
          });
        }).deselect(function () {
          $(document).unbind('click.ninja keydown.ninja keyup.ninja');
          $popup.detach();
          if ($hover) {
            $hover.removeClass('ninja-state-hover');
          }
        }).appendTo($menu);
      $.each(options.choices, function (i, choice) {
        var $choice = $('<div/>', {
          html: choice.display || choice.html || choice
        }).appendTo($popup);
        if (choice.spacer) {
          $choice.addClass('ninja-object-rule');
        } else {
          $choice.addClass('ninja-object-item');
          if ($.isFunction(choice.select)) {
            $choice.bind({
              'click.ninja': function () {
                $button.trigger('deselect.ninja');
                choice.select();
              },
              'mouseenter.ninja': function () {
                if ($hover) {
                  $hover.removeClass('ninja-state-hover');
                }
                $hover = $(this).addClass('ninja-state-hover');
              },
              'mouseleave.ninja': function () {
                $hover.removeClass('ninja-state-hover');
              }
            });
          }
        }
      });
      return $menu.ninja();
    },

    rating: function (options) {
      options = $.extend({}, defaults, {
        starsAverage: 0,
        starsUser: 0
      }, options);
      var $rating = $('<span/>', {
        'class': 'ninjaInline ninjaRating'
      }).bind({
        'mouseleave.ninja': function (event) {
          $('.ninjaStar', $rating).each(function (iStar, star) {
            var $star = $(star);
            if (iStar < options.starsAverage) {
              $star.addClass('ninjaStarAverage');
            } else {
              $star.removeClass('ninjaStarAverage');
            }
            if (iStar < options.starsUser) {
              $star.addClass('ninjaStarUser');
            } else {
              $star.removeClass('ninjaStarUser');
            }
          });
        }
      });
      $.each(options.choices, function (i, choice) {
        var
          iChoice = i + 1,
          $choice = $('<span/>', {
            'class': 'ninjaStar ninjaSymbol ninjaSymbolStar'
          }).append(choice).bind({
            'mouseenter.ninja': function (event) {
              $('.ninjaStar', $rating).each(function (iStar, star) {
                var $star = $(star);
                if (iStar <= i) {
                  $star.addClass('ninjaStarUser');
                } else {
                  $star.removeClass('ninjaStarUser');
                }
              });
            },
            'click.ninja' : function () {
              options.starsUser = iChoice;
              /* individual select function */
              if (choice.select) {
                choice.select();
              }
              /* global select function */
              $rating.trigger({
                type: 'select',
                html: choice.html || choice
              });
            }
          });
        if (iChoice <= options.starsAverage) {
          $choice.addClass('ninjaStarAverage');
        }
        if (iChoice <= options.starsUser) {
          $choice.addClass('ninjaStarUser');
        }
        $rating.append($choice);
      });
      return $rating.ninja();
    },

    slider: function (options) {
      options = $.extend({}, defaults, {
        slot: 0,
        width: 200
      }, options);
      var
        drag = false,
        offsetX = 0,
        touch,
        slots = options.choices.length - 1,
        increment = options.width / slots,
        left = options.slot * increment,
        $choice = $('<span/>', {
          'class': 'ninjaSliderChoice',
          html: options.choices[options.slot].html
        }),
        $button = $('<span/>', {
          'class': 'ninjaSliderButton ninjaInline',
          css: {
            left: left
          }
        }),
        $temp = $button.clone().css({
          display: 'none'
        }).appendTo('body'),
        buttonDiameter = $temp.outerWidth(),
        buttonRadius = buttonDiameter / 2,
        trackWidth = options.width + buttonDiameter,
        $level = $('<div/>', {
          'class': 'ninjaSliderLevel',
          css: {
            marginLeft: buttonRadius,
            marginRight: buttonRadius,
            width: left
          }
        }),
        $slider = $('<span/>', {
          'class': 'ninjaInline ninjaSlider'
        }).bind({
          'change.ninja select.ninja': function (event) {
            var slot = function () {
              if (event.sliderX < 0) {
                return 0;
              } else if (event.sliderX > slots) {
                return slots;
              } else {
                return event.sliderX;
              }
            };
            event.choice = options.choices[slot()];
            $choice.html(event.choice.html);
            left = slot() * increment;
            $button.css({
              left: left
            });
            $level.css({
              width: left
            });
          },
          'select.ninja': function (event) {
            if (event.choice.select) {
              event.choice.select(event);
            }
          }
        }).append($choice),
        $track = $('<div/>', {
          'class': 'ninjaSliderTrack',
          css: {
            width: trackWidth
          }
        }).appendTo($slider),
        $groove = $('<div/>', {
          'class': 'ninjaSliderGroove',
          css: {
            marginLeft: buttonRadius,
            marginRight: buttonRadius,
            opacity: 0.25
          }
        }).bind('click.ninja', function (event) {
          $button.trigger({
            type: 'select.ninja',
            sliderX: Math.round((event.pageX - $track.offset().left) / increment)
          });
        });
      $track.append($level, $groove, $button);
      $temp.remove();
      $choice.css({
        marginRight: buttonRadius
      });
      if (options.title) {
        $choice.before($('<span/>', {
          'class': 'ninjaSliderTitle',
          css: {
            marginLeft: buttonRadius
          },
          text: options.title + ': '
        }));
      } else {
        $choice.css({
          marginLeft: buttonRadius
        });
      }
      $button.bind({
        'mousedown.ninja': function (event) {
          event.preventDefault();
          offsetX = event.pageX - $button.position().left;
          drag = true;
          $(document).bind({
            'mousemove.ninja': function (event) {
              if (!drag) {
                return;
              }
              $slider.trigger({
                type: 'change.ninja',
                sliderX: Math.round((event.pageX - offsetX) / increment)
              });
            },
            'mouseup.ninja': function (event) {
              drag = false;
              $button.trigger({
                type: 'select.ninja',
                sliderX: Math.round((event.pageX - offsetX) / increment)
              });
              $(document).unbind('mousemove.ninja mouseup.ninja');
            }
          });
        },
        'touchstart.ninja': function (event) {
          event.preventDefault();
          touch = event.originalEvent.targetTouches[0] || event.originalEvent.changedTouches[0];
          offsetX = touch.pageX - $button.position().left;
        },
        'touchmove.ninja': function (event) {
          event.preventDefault();
          touch = event.originalEvent.targetTouches[0] || event.originalEvent.changedTouches[0];
          $slider.trigger({
            type: 'change.ninja',
            sliderX: Math.round((touch.pageX - offsetX) / increment)
          });
        },
        'touchend.ninja': function (event) {
          event.preventDefault();
          $button.trigger({
            type: 'select.ninja',
            sliderX: Math.round((touch.pageX - offsetX) / increment)
          });
        }
      });
      return $slider.ninja();
    },

    suggest: function (options) {
      options = $.extend({}, defaults, options);
      var
        $suggest = $('<span/>', {
          'class': 'ninjaEditable ninjaInline ninjaSuggest',
          css: options.css,
          html: options.html
        }),
        $input = $('<input/>', {
          'class': 'ninja-object-suggest',
          type: 'text'
        }),
        $clear = $('<span/>', {
          'class': 'ninjaSuggestClear ninjaSymbol ninjaSymbolClear'
        }).bind('click.ninja', function () {
          $input.val('').focus();
          $clear.css({
            visibility: 'hidden'
          });
        }),
        $popup = $suggest.popup(), value;
      if (options.placeholder) {
        if ($.support.opacity) {
          $input.css({
            opacity: 0.25
          });
        }
        $input.val(options.placeholder);
      }
      $input.bind({
        'focus.ninja': function () {
          if (!$input.is('.ninjaFocused')) {
            if ($.support.opacity) {
              $input.addClass('ninjaFocused').css({
                opacity: 1
              });
            }
            var value = $input.val();
            if (options.placeholder && value === options.placeholder) {
              $input.val('');
            } else {
              if (value !== '') {
                $suggest.trigger({
                  type: 'change.ninja',
                  value: value
                });
                $clear.css({
                  visibility: 'visible'
                });
              }
            }
          }
        },
        'blur.ninja': function (event) {
          if ($input.is('.ninjaFocused')) {
            $input.removeClass('ninjaFocused');
            if (options.placeholder && $input.val() === '') {
              if ($.support.opacity) {
                $input.css({
                  opacity: 0.25
                });
              }
              $input.val(options.placeholder);
            }
            if ($popup.find('.ninja-state-hover').length === 0) {
              $popup.hide();
            }
          }
        },
        'change.ninja select.ninja': function () {/* prevent these events from submitting prematurely */
          return false;
        },
        'keydown.ninja': function (event) {
          value = $input.val();
          if ($.inArray(event.keyCode, [13, 48, 56, 57, 219, 220]) > -1) {/* return or regular expression metacharacters */
            return false;
          } else if (event.keyCode === 8 && value.length === 1) {/* delete last character */
            $clear.css({
              visibility: 'hidden'
            });
            $popup.hide();
          }
        },
        'keyup.ninja': function (event) {
          if (event.keyCode === 27) {/* escape */
            $input.blur();
          }
          if (event.keyCode === 13) {/* return */
            if ($('.ninjaStateHovered', $popup).length === 0) {
              $suggest.trigger({
                type: 'select.ninja',
                html: $input.val()
              });
            }
            $popup.hide();
          } else if ($.inArray(event.keyCode, [38, 40]) === -1) {/* not down nor up */
            var valueNew = $input.val();
            if (event.keyCode !== 8 && valueNew.length === 1) {/* first character */
              $clear.css({
                visibility: 'visible'
              });
            }
            if (valueNew.length > 0 && value !== valueNew) {
              $suggest.trigger({
                type: 'change.ninja',
                value: valueNew
              });
            }
          }
        }
      });
      $suggest.bind({
        'error.ninja': function (event) {
          $popup.update({
            html: $('<div/>', {
              'class': 'ninjaError',
              text: 'Error: ' + event.message
            })
          }).css({
            minWidth: $suggest.outerWidth()
          });
        },
        'select.ninja': function (event) {
          if (event.html) {
            $input.val($.trim(event.html.toString().replace(new RegExp('/<\/?[^>]+>/', 'gi'), '')));
          } else {
            event.html = $input.val();
          }
          $input.blur();
          $popup.hide();
        },
        'update.ninja': function (event) {
          if (event.choices.length) {
            value = $input.val();
            $popup.show().update({
              html: $.ninja.list({
                choices: $.map(event.choices, function (choice) {
                  choice.display = choice.html.toString().replace(new RegExp(value, 'gi'), '<strong>' + value + '</strong>');
                  choice.html = choice.html || choice;
                  choice.select = function () {
                    $suggest.trigger({
                      type: 'select.ninja',
                      html: choice.html || choice
                    });
                  };
                  return choice;
                })
              })
            }).css({
              minWidth: $suggest.outerWidth()
            });
          } else {
            $popup.hide();
          }
        }
      }).append($input, $clear);
      return $suggest.ninja();
    },

    tabs: function (options) {
      options = $.extend({}, defaults, {
        choice: 0
      }, options);
      var
        $object = this,
        $tabs = $('<span/>', {
          css: options.css
        });
      if (options.vertical) {
        $tabs.addClass('ninja-tabs-vertical');
      } else {
        $tabs.addClass('ninja-tabs-horizontal');
      }
      $.each(options.choices, function (i, choice) {
        var $choice = $('<span/>', {
          'class': 'ninja ninja-tab',
          html: choice.html || choice
        }).bind({
          'click.ninja': function () {
            $('.ninja-tab', $tabs).removeClass('ninja-state-select');
            $choice.addClass('ninja-state-select');
            $tabs.trigger({
              type: 'select.ninja',
              html: choice.html || choice
            });
            if ($.isFunction(choice.select)) {
              choice.select();
            }
          }
        });
        if (i === 0) {
          $choice.addClass('ninja-tab-first');
        } else if (i === options.choices.length - 1) {
          $choice.addClass('ninja-tab-last');
        }
        if (i === options.choice - 1) {
          $choice.addClass('ninja-state-select');
        }
        $tabs.append($choice);
      });
      return $tabs.ninja();
    },

    version: function () {
      return 'development';
    }

  };

  $.ninja = objects;

  $.fn.ninja = function () {
    return this.extend(methods);
  };

}(jQuery, window, document));
