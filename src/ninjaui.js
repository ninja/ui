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
    defaults,
    objects,
    methods,
    time,
    version = $.fn.jquery.split('.'),
    versionMinor = parseFloat(version[1]),
    versionIncrement = parseFloat(version[2] || '0');

  if (versionMinor === 4 && versionIncrement < 3 || versionMinor < 4)
  {
    $.error('Ninja UI requires jQuery 1.4.3 or higher to support SVG icon creation, CSS hooks and the $.now() utility.');
  }

  if ($.browser.msie && parseInt($.browser.version, 10) < '9') {
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

    change: function (callback) {
      return this.each(function () {
        var $object = $(this);
        if ($.isFunction(callback)) {
          $object.bind('change.ninja', callback);
        } else {
          $object.trigger('change.ninja');
        }
      });
    },

    deselect: function (callback) {
      return this.each(function () {
        var $object = $(this);
        if (callback && $.isFunction(callback)) {
          $object.bind('deselect.ninja', callback);
        } else if ($object.is('.ninja-state-selected') && !$object.is('.ninja-state-disabled')) {
          $object.trigger('deselect.ninja');
        }
      });
    },

    detach: function () {
      this.trigger('detach.ninja');
      $.fn.detach.apply(this);
    },

    disable: function (callback) {
      return this.each(function () {
        var $object = $(this);
        if (callback && $.isFunction(callback)) {
          $object.bind('disable.ninja', callback);
        } else {
          $object.fadeTo('fast', 0.5).addClass('ninja-state-disabled').trigger('disable.ninja');
        }
      });
    },

    enable: function (callback) {
      return this.each(function () {
        var $object = $(this).ninja();
        if ($.isFunction(callback)) {
          $object.bind('enable.ninja', callback);
        } else {
          $object.fadeTo('fast', 1).removeClass('ninja-state-disabled').trigger('enable.ninja');
        }
      });
    },

    remove: function () {
      this.trigger('remove.ninja');
      $.fn.remove.apply(this);
    },

    select: function (event) {
      return this.each(function () {
        var $object = $(this);
        if ($.isFunction(event)) {
          $object.bind('select.ninja', event);
        } else if (!$object.is('.ninja-state-disabled')) {
          $object.trigger('select.ninja');
        }
      });
    },

    update: function (callback) {
      return this.each(function () {
        var $object = $(this);
        if ($.isFunction(callback)) {
          $object.bind('update.ninja', callback);
        } else if (callback) {
          if (callback.html) {
            $object.trigger({
              type: 'update.ninja',
              html: callback.html
            });
          } else if (callback.choices) {
            $object.trigger({
              type: 'update.ninja',
              choices: callback.choices
            });
          }
        } else {
          $object.trigger('update.ninja');
        }
      });
    }

  };

  objects = {

    button: function (options) {
      options = $.extend({}, defaults, options);
      var $button = $('<span/>', {
        'class': 'ninja-object-button',
        css: options.css,
        html: options.html
      });
      $button.bind({
        'click.ninja': function () {
          if (!$button.is('.ninja-state-disabled')) {
            if ($button.is('.ninja-state-selected')) {
              $button.trigger('deselect.ninja');
            } else {
              $button.trigger('select.ninja');
            }
          }
        },
        'deselect.ninja': function () {
          $button.removeClass('ninja-state-selected');
        },
        'mouseenter.ninja': function () {
          if (!$button.is('.ninja-state-disabled')) {
            $button.addClass('ninja-state-hovered');
          }
        },
        'mouseleave.ninja': function () {
          if (!$button.is('.ninja-state-disabled')) {
            $button.removeClass('ninja-state-hovered');
          }
        },
        'select.ninja': function () {
          $button.addClass('ninja-state-selected');
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
          name: 'arrow-down'
        }),
        $arrowRight = $.ninja.icon({
          name: 'arrow-right'
        }),
        $handle = $.ninja.button($.extend({}, options, {
          css: null,
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
        defs = '',
        g = '',
        id = uniqueId(),
        idMask = id + 'Mask',
        idSymbol = id + 'Symbol',
        idVector = id + 'Vector',
        mask = '',
        onload = '',
        points = '';
      if ($.inArray(options.name, ['arrow-down', 'arrow-right']) > -1) {
        if (options.name === 'arrow-down') {
          points = '128,128 384,128 256,384';
        } else {
          points = '128,128 384,256 128,384';
        }
        g = '<polygon points="' + points + '"/>';
      } else if (options.name === 'camera') {
        defs = '<defs><mask id="' + idMask + '"><rect fill="#fff" x="0" y="0" width="512" height="512"/><circle cx="256" cy="288" r="160"/></mask></defs>';
        g = '<rect x="0" y="128" width="512" height="352" rx="64" ry="64" mask="url(#' + idMask + ')"/><polygon points="128,256 128,128 192,32 320,32 384,128 384,256" mask="url(#' + idMask + ')"/><circle cx="256" cy="288" r="96"/>';
      } else if ($.inArray(options.name, ['circle', 'circle-clear', 'circle-minus', 'circle-plus']) > -1) {
        if (options.name === 'circle-clear') {
          mask = '<polygon points="224,128 288,128 288,224 384,224 384,288 288,288 288,384 224,384 224,288 128,288 128,224 224,224" transform="rotate(45 256 256)"/>';
        } else if (options.name === 'circle-minus') {
          mask = '<rect x="128" y="224" width="256" height="64"/>';
        } else if (options.name === 'circle-plus') {
          mask = '<polygon points="224,128 288,128 288,224 384,224 384,288 288,288 288,384 224,384 224,288 128,288 128,224 224,224"/>';
        }
        defs = '<defs><mask id="' + idMask + '"><rect fill="#fff" x="0" y="0" width="512" height="512"/>' + mask + '</mask></defs>';
        g = '<circle cx="256" cy="256" mask="url(#' + idMask + ')" r="256"/>';
      } else if (options.name === 'go') {
        g = '<circle fill="none" stroke-width="64" cx="256" cy="256" r="224"/>';
      } else if (options.name === 'home') {
        g = '<polygon points="0,320 0,256 256,0 512,256 512,320 448,320 448,512 320,512 320,320 192,320 192,512 64,512 64,320"/><rect x="352" y="32" width="128" height="256"/>';
      } else if (options.name === 'mail') {
        g = '<polygon points="0,112 128,240 0,368"/><polygon points="0,80 512,80 256,336"/><polygon points="384,240 512,112 512,368"/><polygon points="0,432 0,400 144,256 256,368 368,256 512,400 512,432"/>';
      } else if (options.name === 'search') {
        g = '<circle fill="none" stroke-width="48" cx="200" cy="200" r="176"/><polygon points="288,352 352,288 512,448 448,512"/>';
      } else if (options.name === 'star') {
        g = '<polygon points="0,196 196,196 256,0 316,196 512,196 354,316 414,512 256,392 98,512 158,316"/>';
      } else if (options.name === 'stop') {
        g = '<polygon points="0,362 0,150 150,0 362,0 512,150 512,362 362,512 150,512"/>';
      } else if ($.inArray(options.name, ['triangle', 'warn']) > -1) {
        if (options.name === 'warn') {
          mask = '<polygon points="256,192 384,448 128,448"/>';
        }
        defs = '<defs><mask id="' + idMask + '"><rect fill="#fff" x="0" y="0" width="512" height="512"/>' + mask + '</mask></defs>';
        g = '<polygon mask="url(#' + idMask + ')" points="256,0 512,512 0,512"/>';
      } else {
        onload = ' onload="var frame=0;setInterval(function(){frame=frame+30;if(frame===360){frame=0}document.getElementById(\'' + idVector + '\').setAttributeNS(null,\'transform\',\'rotate(\'+frame+\' 256 256)\');},100)"';
        defs = '<defs><rect id="' + idSymbol + '" x="224" rx="24" width="64" height="128"/></defs>';
        g = '<use xlink:href="#' + idSymbol + '" style="opacity:.1" transform="rotate(30 256 256)"/><use xlink:href="#' + idSymbol + '" style="opacity:.2" transform="rotate(60 256 256)"/><use xlink:href="#' + idSymbol + '" style="opacity:.3" transform="rotate(90 256 256)"/><use xlink:href="#' + idSymbol + '" style="opacity:.4" transform="rotate(120 256 256)"/><use xlink:href="#' + idSymbol + '" style="opacity:.5" transform="rotate(150 256 256)"/><use xlink:href="#' + idSymbol + '" style="opacity:.6" transform="rotate(180 256 256)"/><use xlink:href="#' + idSymbol + '" style="opacity:.7" transform="rotate(210 256 256)"/><use xlink:href="#' + idSymbol + '" style="opacity:.8" transform="rotate(240 256 256)"/><use xlink:href="#' + idSymbol + '" style="opacity:.9" transform="rotate(270 256 256)"/><use xlink:href="#' + idSymbol + '" style="opacity:.9.5" transform="rotate(300 256 256)"/><use xlink:href="#' + idSymbol + '" style="opacity:.9.75" transform="rotate(330 256 256)"/><use xlink:href="#' + idSymbol + '"/>';
      }
      $icon = $('<svg aria-label="' + options.name + '" class="ninja-object-icon" height="1" width="1"' + onload + ' role="img" version="1.1" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><title>' + options.name + '</title>' + defs + '<g id="' + idVector + '" stroke="#000">' + g + '</g></svg>');
      if (options.css) {
        $icon.find('g').css(options.css);
      }
      return $icon;
    },

    menu: function (options) {
      options = $.extend({}, defaults, options);
      var
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
          name: 'arrow-down'
        })).select(function () {
          $menu.append($popup).delegate('div.ninja-object-item', 'mouseenter.ninja', function () {
            $popup.find('.ninja-state-hovered').removeClass('ninja-state-hovered');
            $(this).addClass('ninja-state-hovered');
          }).delegate('div.ninja-menu-choice', 'mouseleave.ninja', function () {
            $popup.find('.ninja-state-hovered').removeClass('ninja-state-hovered');
            $(this).addClass('ninja-state-hovered');
          }).delegate('div.ninja-object-item', 'click.ninja', function () {
            $popup.detach();
          }).deselect(function () {
            $popup.detach();
          });
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
            $choice.bind('click.ninja', function () {
              choice.select();
              $button.ninja().deselect();
            });
          }
        }
      });
      $(document).unbind('keydown.ninja keyup.ninja').bind({
        'keydown.ninja': function (event) {
          if ($.inArray(event.keyCode, [38, 40]) > -1) {/* down or up */
            return false;/* prevents page scrolling via the arrow keys when a list is active */
          }
        },
        'keyup.ninja': function (event) {
          if ($.inArray(event.keyCode, [13, 38, 40]) > -1) {/* return, down or up */
            var $button = $('.ninja-state-hovered', $popup);
            if (event.keyCode === 13) {/* return */
              $button.click();
              $(document).unbind('keydown.ninja keyup.ninja');
            } else if (event.keyCode === 40) {/* down arrow */
              if ($button.length) {
                $button.mouseleave();
                if ($button.nextAll('.ninja-object-item').length) {
                  $button.nextAll('.ninja-object-item:first').trigger('mouseenter.ninja');
                } else {
                  $('.ninja-object-item:first', $popup).trigger('mouseenter.ninja');
                }
              } else {
                $('.ninja-object-item:first', $popup).trigger('mouseenter.ninja');
              }
            } else if (event.keyCode === 38) {/* up arrow */
              if ($button.length) {
                $button
                  .trigger('mouseleave.ninja')
                  .prevAll('.ninja-menu-choice:first').trigger('mouseenter.ninja');
              } else {
                $('.ninja-menu-choice:last', $popup).trigger('mouseenter.ninja');
              }
            }
            return false;
          }
        }
      });
      return $menu.ninja();
    },

    popup: function (options) {
      options = $.extend({}, defaults, {
        button: false,
        window: false
      }, options);
      var
        id = uniqueId(),
        $object = this,
        $popup = $('<span/>', {
          'class': 'ninja-popup',
          css: $.extend(options.css, {
            minWidth: $object.width()
          })
        });
      $popup.bind({
        'detach.ninja remove.ninja': function () {
          if ($object.is('.ninja-state-selected')) {
            $object.deselect();
          }
          $(document).unbind('click.ninja' + id);
        },
        'update.ninja': function (event) {
          $popup.html(event.html);
          var $button, offset, $stem;
          if (options.button) {
            $button = $.ninja.icon({
              name: 'circle-clear'
            }).addClass('ninja-popup-button').click(function () {
              $popup.remove();
            });
            $popup.append($button);
          }
          $(document.body).append($popup);
          if (options.window) {
            $popup.css({
              left: ($(window).width() / 2) - ($popup.width() / 2),
              top: ($(window).height() / 2) - ($popup.height() / 2) + $(window).scrollTop()
            });
          } else {
            offset = $object.offset();
            $stem = $.ninja.icon({
              name: 'triangle'
            }).addClass('ninja-popup-stem');
            $popup.css({
              top: offset.top + $object.height()
            });
            if (offset.left + $popup.width() > $(window).width()) {
              $popup.css({
                right: 0
              });
              $stem.css({
                right: $object.width() / 2
              });
            } else {
              $popup.css({
                left: offset.left
              });
              $stem.css({
                left: $object.width() / 2
              });
            }
            $popup.append($stem);
            $(document).bind('click.ninja' + id, function (event) {
              if ($popup.is(':visible')) {
                var $parents = $(event.target).parents();
                if ($.inArray($popup[0], $parents) < 0 && $object[0] !== event.target && $.inArray($object[0], $parents) < 0) {
                  $popup.detach();
                }
              }
            });
          }
          $(document).bind('keydown.ninja', function (event) {
            if (event.keyCode === 27) {/* escape */
              $popup.detach();
              $(document).unbind('keydown.ninja');
            }
          });
        }
      });
      if (options.html) {
        $popup.trigger({
          type: 'update.ninja',
          html: options.html
        });
      }
      return $popup.ninja();
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
            if ($('.ninja-state-hovered', $popup).length === 0) {
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
            $('.ninja-tab', $tabs).removeClass('ninja-state-selected');
            $choice.addClass('ninja-state-selected');
            $tabs.trigger({
              type: 'select.ninja',
              html: choice.html || choice
            });
            if ($.isFunction(choice.select)) {
              choice.select();
            }
          },
          'mouseenter.ninja': function () {
            $choice.addClass('ninja-state-hovered');
          },
          'mouseleave.ninja': function () {
            $choice.removeClass('ninja-state-hovered');
          }
        });
        if (i === 0) {
          $choice.addClass('ninja-tab-first');
        } else if (i === options.choices.length - 1) {
          $choice.addClass('ninja-tab-last');
        }
        if (i === options.choice - 1) {
          $choice.addClass('ninja-state-selected');
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
