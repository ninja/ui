/*!
  Ninja UI jQuery Plugin vdevelopment
  http://ninjaui.com/

  Copyright 2008-2011 Jamie Hoover
  Licensed per the terms of the Apache License v2.0
  http://ninjaui.com/license
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

    delist: function (callback) {
      return this.each(function () {
        var $object = $(this).ninja();
        if ($.isFunction(callback)) {
          $object.bind('delist.ninja', callback);
        } else {
          $object.trigger('delist.ninja');
        }
      });
    },

    deselect: function (callback) {
      return this.each(function () {
        var $object = $(this).ninja();
        if ($.isFunction(callback)) {
          $object.bind('deselect.ninja', callback);
        } else if ($object.is('.nui-select') && !$object.is('.nui-disable')) {
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
          $object.fadeTo('fast', 0.5).addClass('nui-disable').trigger('disable.ninja');
        }
      });
    },

    enable: function (callback) {
      return this.each(function () {
        var $object = $(this).ninja();
        if ($.isFunction(callback)) {
          $object.bind('enable.ninja', callback);
        } else {
          $object.fadeTo('fast', 1).removeClass('nui-disable').trigger('enable.ninja');
        }
      });
    },

    hint: function (options) {
      return this.each(function () {
        options = $.extend({}, defaults, options);
        var
          $object = $(this),
          $hint = $('<span/>', {
            'class': 'nui-hint',
            css: options.css,
            html: options.html
          }),
          $stem = $('<svg class="nui-stem" height="1" width="1" version="1.1" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg"><g><polygon points="4,1 8,8 1,8" stroke-width="0"/><line x1="4" x2="0" y2="8"/><line x1="4" x2="8" y2="8"/></g></svg>').appendTo($hint);
        if (options.css) {
          $stem.find('g').css(options.css);
        }
        $object.bind({
          'mouseenter.ninja': function () {
            $hint.css({
              top: $object.outerHeight() + 6
            }).appendTo($object);
            if (($hint.offset().left + $hint.outerWidth()) > ($(window).scrollLeft() + $(window).width())) {
              $hint.css({
                left: 'auto',
                right: 0
              });
              $stem.css({
                left: 'auto',
                right: ($object.outerWidth() / 2) - 4
              });
            } else {
              $hint.css({
                left: 0,
                right: 'auto'
              });
              $stem.css({
                left: ($object.outerWidth() / 2) - 4,
                right: 'auto'
              });
            }
          },
          'mouseleave.ninja select.ninja': function () {
            $hint.detach();
          }
        });
      });
    },

    list: function (options) {
      return this.each(function () {
        options = $.extend({}, defaults, options);
        var
          $hover = null,
          $object = $(this).ninja(),
          $list = $('<div/>', {
            'class': 'nui-list'
          });
        if ($object.is('.nui-autocomplete')) {
          $object.find('.nui-icon[aria-label=spin]').hide();
        }
        if (options.choices.length) {
          $object.bind({
            'delist.ninja': function () {
              $(document).unbind('click.ninja keydown.ninja keyup.ninja');
              $list.detach();
              if ($hover) {
                $hover.removeClass('nui-hover');
              }
            }
          });
          $object.append($list);
          $(document).bind({
            'keydown.ninja': function (event) {
              if ($.inArray(event.keyCode, [9, 38, 40]) > -1) {/* down or up */
                event.preventDefault();/* prevents page scrolling and tabbing when a list is active */
              }
            },
            'keyup.ninja': function (event) {
              if ($.inArray(event.keyCode, [9, 13, 27, 38, 40]) > -1) {/* tab, return, escape, down or up */
                if (event.keyCode === 13) {/* return */
                  if ($hover) {
                    $hover.click();
                  }
                } else if (event.keyCode === 27) {/* escape */
                  $object.delist();
                } else if ($.inArray(event.keyCode, [9, 40]) > -1 && !event.shiftKey) {/* tab or down arrow */
                  if ($hover) {
                    if ($hover.nextAll('.nui-item').length) {
                      $hover.nextAll('.nui-item:first').trigger('mouseenter.ninja');
                    } else {
                      $list.find('.nui-item:first').trigger('mouseenter.ninja');
                    }
                  } else {
                    $list.find('.nui-item:first').trigger('mouseenter.ninja');
                  }
                } else if (event.keyCode === 38 || (event.shiftKey && event.keyCode === 9)) {/* shift+tab or up arrow */
                  if ($hover) {
                    if ($hover.prevAll('.nui-item').length) {
                      $hover.prevAll('.nui-item:first').trigger('mouseenter.ninja');
                    } else {
                      $list.find('.nui-item:last').trigger('mouseenter.ninja');
                    }
                  } else {
                    $list.find('.nui-item:last').trigger('mouseenter.ninja');
                  }
                }
                return false;
              }
            },
            'click.ninja': function (event) {
              $object.delist();
            }
          });
          if (options.query) {
            options.choices = $.map(options.choices, function (item) {
              item.value = item.value  || item.html || item;
              if (item.html) {
                item.html = item.html.toString().replace(new RegExp(options.query, 'gi'), '<b>' + options.query + '</b>');
              }
              return item;
            });
          }
          $.each(options.choices, function (i, choice) {
            var $choice;
            if (choice.spacer) {
              $choice = $('<div/>', {
                'class': 'nui-rule'
              });
            } else {
              $choice = $('<button/>', {
                'class': 'nui-item'
              });
              $choice.bind({
                'mouseleave.ninja': function () {
                  $hover.removeClass('nui-hover');
                },
                'click.ninja': function () {
                  $object.trigger('delist.ninja').focus();
                  if ($object.is('input[type=text]')) {
                    $object.val(choice.value);
                  }
                  if ($.isFunction(choice.select)) {
                    choice.select();
                  }
                },
                'mouseenter.ninja': function () {
                  if ($hover) {
                    $hover.trigger('mouseleave.ninja');
                  }
                  $hover = $choice.addClass('nui-hover');
                }
              });
            }
            $choice.html(choice.html || choice).appendTo($list);
          });
          if (($list.offset().top + $list.outerHeight()) > ($(window).scrollTop() + $(window).height())) {
            $list.css({
              bottom: 0
            });
          } else {
            $list.css({
              top: $object.outerHeight()
            });
          }
          if (($list.offset().left + $list.outerWidth()) > ($(window).scrollLeft() + $(window).width())) {
            $list.css({
              right: 0
            });
          } else {
            $list.css({
              left: 0
            });
          }
        }
      });
    },

    placeholder: function (placeholder) {
      return this.each(function () {
        var
          $object = $(this).ninja(),
          value;
        if ($object.is('input[type=search], input[type=text]')) {
          if ('placeholder' in $object) {
            $object.attr('placeholder', placeholder);
          } else {
            $object.bind({
              'blur.ninja': function () {
                value = $object.val();
                if (value === '' || value === placeholder) {
                  $object.addClass('nui-placeholder');
                  if (value === '') {
                    $object.val(placeholder);
                  }
                }
              },
              'focus.ninja': function () {
                if ($object.val() === placeholder) {
                  $object.removeClass('nui-placeholder').val('');
                }
              }
            }).trigger('blur.ninja');
          }
        }
      });
    },

    select: function (event) {
      return this.each(function () {
        var $object = $(this).ninja();
        if ($.isFunction(event)) {
          $object.bind('select.ninja', event);
        } else if (!$object.is('.nui-disable')) {
          $object.trigger('select.ninja');
        }
      });
    },

    source: function (callback) {
      return this.each(function () {
        var $object = $(this).ninja();
        if ($.isFunction(callback)) {
          $object.bind('source.ninja', callback);
        } else if ($object.val() !== '') {
          $object.trigger('source.ninja');
        }
      });
    }

  };

  objects = {

    autocomplete: function (options) {
      options = $.extend({}, defaults, options);
      var
        timer,
        $autocomplete = $('<span/>', {
          'class': 'nui-autocomplete'
        }).bind({
          'select.ninja': function (event) {
            if (event.html) {
              $input.val($.trim(event.html.toString().replace(new RegExp('/<\/?[^>]+>/', 'gi'), '')));
            } else {
              event.html = $input.val();
            }
          },
          'source.ninja': function (event) {
            $input.delist();
            event.query = $input.val();
          }
        }),
        $input = $('<input/>', {
          'class': 'nui-input',
          type: 'text'
        }).bind({
          'keyup.ninja': function (event) {
            clearTimeout(timer);
            if ($.inArray(event.keyCode, [9, 13, 27, 37, 38, 39, 40]) === -1 && $input.val() !== '') {/* not tab, return, escape, left , up, right or down */
              timer = setTimeout(function () {
                var $spin = $autocomplete.find('.nui-icon[aria-label=spin]');
                if ($spin.is(':hidden')) {
                  $spin.show();
                } else {
                  $.ninja.icon({
                    name: 'spin'
                  }).appendTo($autocomplete);
                }
                $input.source();
              }, 1000);
            }
          }
        }).appendTo($autocomplete);
      if (options.placeholder) {
        $input.ninja().placeholder(options.placeholder);
      }
      return $autocomplete.ninja();
    },

    button: function (options) {
      options = $.extend({}, defaults, options);
      var $button = $('<button/>', {
        'class': 'nui-button',
        css: options.css,
        html: options.html
      });
      $button.bind({
        'click.ninja': function (event) {
          if (!$button.is('.nui-disable')) {
            if ($button.is('.nui-select')) {
              $button.trigger('deselect.ninja');
            } else {
              $button.trigger('select.ninja');
            }
          }
          event.stopImmediatePropagation();
        },
        'deselect.ninja': function () {
          $button.removeClass('nui-select');
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
          $button.addClass('nui-select');
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
        $dialog = $('<span/>', {
          'class': 'nui-dialog',
          css: options.css,
          html: options.html
        }),
        $button = $.ninja.icon({
          name: 'X'
        }).bind('click.ninja', function () {
          $dialog.detach();
        }).appendTo($dialog),
        $blocker = $('<div/>', {
          'class': 'nui-blocker'
        }).bind('click.ninja', function (event) {
          if ($.inArray($dialog[0], $(event.target).parents()) === -1) {
            $dialog.detach();
          }
        });
      $dialog.bind({
        'attach.ninja': function (event) {
          options.$parent.append($blocker, $dialog);
          $blocker.height(options.$parent.height());
          $dialog.css({
            left: ($(window).width() / 2) - ($dialog.width() / 2),
            top: ($(window).height() / 2) - ($dialog.height() / 2) + $(window).scrollTop()
          });
          $(document).bind({
            'keyup.ninja': function (event) {
              if (event.keyCode === 27) {/* escape */
                $dialog.detach();
              }
            }
          });
        },
        'detach.ninja remove.ninja': function () {
          $(document).unbind('click.ninja keydown.ninja');
          $blocker.detach();
        }
      });
      return $dialog.ninja();
    },

    drawer: function (options) {
      options = $.extend({}, defaults, options);
      var
        $drawer = $('<div/>', {
          'class': 'nui-drawer',
          css: options.css
        }),
        $tray = $('<div/>', {
          'class': 'nui-tray',
          html: options.html
        }).appendTo($drawer),
        $arrowDown = $.ninja.icon({
          name: 'arrow-down'
        }),
        $arrowRight = $.ninja.icon({
          name: 'arrow-right'
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
      if ($.inArray(options.name, ['arrow-down', 'arrow-right']) > -1) {
        if (options.name === 'arrow-down') {
          points = '4,4 12,4 8,12';
        } else {
          points = '4,4 12,8 4,12';
        }
        g = '<polygon points="' + points + '"/>';
      } else if (options.name === 'camera') {
        defs = '<defs><mask id="' + idMask + '">' + maskBackground + '<circle cx="8" cy="9" r="5"/></mask></defs>';
        g = '<rect x="0" y="4" width="16" height="11" rx="2" ry="2" mask="url(#' + idMask + ')"/><polygon points="4,8 4,4 6,1 10,1 12,4 12,8" mask="url(#' + idMask + ')"/><circle cx="8" cy="9" r="3"/>';
      } else if ($.inArray(options.name, ['X', 'x', '-', '+']) > -1) {
        if (options.name === '-') {
          mask = '<rect x="4" y="7" width="8" height="2"/>';
        } else {
          if (options.name !== '+') {
            rotate = ' transform="rotate(45 8 8)"';
          }
          mask = '<polygon points="7,4 9,4 9,7 12,7 12,9 9,9 9,12 7,12 7,9 4,9 4,7 7,7"' + rotate + '/>';
        }
        if (options.name === 'X') {
          g = '<circle cx="8" cy="8" r="7"/><polygon points="7,4 9,4 9,7 12,7 12,9 9,9 9,12 7,12 7,9 4,9 4,7 7,7"' + rotate + '/>';
        } else {
          defs = '<defs><mask id="' + idMask + '">' + maskBackground + mask + '</mask></defs>';
          g = '<circle cx="8" cy="8" mask="url(#' + idMask + ')" r="8"/>';
        }
      } else if (options.name === 'email') {
        g = '<polygon points="0,2 8,10 16,2"/><polygon points="16,4 12,8 16,12"/><polygon points="0,14 5,9 8,12 11,9 16,14"/><polygon points="0,4 4,8 0,12"/>';
      } else if (options.name === 'go') {
        g = '<circle' + border + ' cx="8" cy="8" r="7"/><circle cx="8" cy="8" r="5"/>';
      } else if (options.name === 'home') {
        g = '<polygon points="0,10 0,8 8,0 16,8 16,10 14,10 14,16 10,16 10,10 6,10 6,16 2,16 2,10"/><rect x="11" y="16" width="4" height="8"/>';
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
      $icon = $('<svg aria-label="' + options.name + '" class="nui-icon" height="1" width="1"' + onload + ' role="img" version="1.1" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><title>' + options.name + '</title>' + defs + '<g id="' + idVector + '" stroke-width="0">' + g + '</g></svg>');
      if (options.css) {
        $icon.find('g').css(options.css);
      }
      return $icon;
    },

    menu: function (options) {
      options = $.extend({}, defaults, options);
      var $menu = $.ninja.button($.extend({}, options, {
        html: options.html
      })).addClass('nui-menu').append($.ninja.icon({
        name: 'arrow-down'
      })).select(function () {
        $menu.blur().list(options);
      }).deselect(function () {
        $menu.delist();
      }).delist(function () {
        $menu.deselect();
      });
      return $menu;
    },

    rating: function (options) {
      options = $.extend({}, defaults, {
        average: 0,
        select: 0,
        stars: 5
      }, options);
      var
        i,
        $rating = $('<span/>', {
          'class': 'nui-rating'
        }).bind({
          'mouseleave.ninja': function () {
            $rating.find('.nui-star').each(function (ii, star) {
              var $star = $(star);
              if (options.select === 0) {
                if (ii < options.average) {
                  $star.addClass('nui-average');
                } else {
                  $star.removeClass('nui-average');
                }
              }
              if (ii < options.select) {
                $star.addClass('nui-individual');
              } else {
                $star.removeClass('nui-individual');
              }
            });
          }
        });
      for (i = 0; i < options.stars; i++) {
        $('<button/>', {
          'class': 'nui-star',
          html: $.ninja.icon({
            'name': 'star'
          })
        }).appendTo($rating);
      }
      $rating.find('.nui-star').each(function (i, star) {
        i++;
        var $star = $(star);
        $star.bind({
          'click.ninja select.ninja': function () {
            options.select = i;
            $rating.trigger('mouseleave.ninja').trigger({
              type: 'select',
              stars: i
            });
          },
          'mouseenter.ninja': function () {
            $rating.find('.nui-star').each(function (ii, star) {
              var $star = $(star).removeClass('nui-average');
              if (ii < i) {
                $star.addClass('nui-individual');
              } else {
                $star.removeClass('nui-individual');
              }
            });
          }
        });
      });
      $rating.trigger('mouseleave.ninja');
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
          'class': 'nui-slider-choice',
          html: options.choices[options.slot].html
        }),
        $button = $('<button/>', {
          'class': 'nui-slider-button',
          css: { left: left }
        }),
        trackWidth = options.width + 18,
        $level = $('<div/>', {
          'class': 'nui-slider-level',
          css: { width: left }
        }),
        $slider = $('<span/>', {
          'class': 'nui-slider'
        }).bind({
          'change.ninja select.ninja': function (event) {
            var slot;
            if (event.sliderX < 0) {
              slot = 0;
            } else if (event.sliderX > slots) {
              slot = slots;
            } else {
              slot = event.sliderX;
            }
            event.choice = options.choices[slot];
            $choice.html(event.choice.html);
            left = slot * increment;
            $button.css({ left: left });
            $level.css({ width: left });
          },
          'select.ninja': function (event) {
            if (event.choice.select) {
              event.choice.select(event);
            }
          }
        }).append($choice),
        $track = $('<div/>', {
          'class': 'nui-slider-track',
          css: { width: trackWidth }
        }).appendTo($slider),
        $groove = $('<div/>', {
          'class': 'nui-slider-groove'
        }).bind('click.ninja', function (event) {
          $button.trigger({
            type: 'select.ninja',
            sliderX: Math.round((event.pageX - $track.offset().left) / increment)
          });
        });
      $track.append($groove.append($level), $button);
      if (options.title) {
        $choice.before($('<span/>', {
          'class': 'nui-slider-title',
          text: options.title + ': '
        }));
      }
      $button.bind({
        'keyup.ninja': function (event) {
          if ($.inArray(event.keyCode, [37, 39]) > -1) {/* right or left */
            var
              choice,
              slot = Math.round($button.position().left / increment);
            if (slot > 0 && event.keyCode === 37) {/* left arrow */
              slot--;
            } else if (slot < slots && event.keyCode === 39) {/* right arrow */
              slot++;
            }
            choice = options.choices[slot];
            $choice.html(choice.html);
            left = slot * increment;
            $button.css({ left: left });
            $level.css({ width: left });
            return false;
          }
        },
        'mousedown.ninja touchstart.ninja': function (event) {
          event.preventDefault();
          $button.addClass('nui-select');
          return false;
        },
        'mousedown.ninja': function (event) {
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
              $button.removeClass('nui-select');
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
          touch = event.originalEvent.targetTouches[0] || event.originalEvent.changedTouches[0];
          offsetX = touch.pageX - $button.position().left;
        },
        'touchmove.ninja': function (event) {
          event.preventDefault();
          if (!touch) {
            return;
          }
          touch = event.originalEvent.targetTouches[0] || event.originalEvent.changedTouches[0];
          $slider.trigger({
            type: 'change.ninja',
            sliderX: Math.round((touch.pageX - offsetX) / increment)
          });
        },
        'touchend.ninja': function (event) {
          event.preventDefault();
          $button.removeClass('nui-select').trigger({
            type: 'select.ninja',
            sliderX: Math.round((touch.pageX - offsetX) / increment)
          });
        }
      });
      return $slider.ninja();
    },

    tabs: function (options) {
      options = $.extend({}, defaults, {
        choice: 1
      }, options);
      var $tabs = $('<span/>');
      if (options.vertical) {
        $tabs.addClass('nui-tabs-vertical');
      } else {
        $tabs.addClass('nui-tabs-horizontal');
      }
      $.each(options.choices, function (i, choice) {
        var $tab = $('<button/>', {
          'class': 'nui-tab',
          css: options.css,
          html: choice.html || choice
        }).bind({
          'click.ninja': function () {
            if (!$tab.is('.nui-disable') && !$tab.is('.nui-select')) {
              $tab.trigger('select.ninja');
            }
          },
          'disable.ninja': function () {
            $tab.attr({
              disabled: 'disabled'
            });
          },
          'enable.ninja': function () {
            $tab.attr({
              disabled: false
            });
          },
          'select.ninja': function () {
            $tabs.children().not($tab).removeClass('nui-select');
            $tab.addClass('nui-select');
            if ($.isFunction(choice.select)) {
              choice.select();
            }
          }
        }).appendTo($tabs);
        if (i === options.choice - 1) {
          $tab.select();
        }
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
