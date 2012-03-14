/*
  Ninja User Interface jQuery Plugin VERSION
  http://ninjaui.com/
  Copyright 2008-YEAR Jamie Hoover
  Licensed per the terms of the Apache License v2.0
  http://ninjaui.com/#license
*/

(function ($, window, document, undefined) {

  'use strict';

  var
    defaults,
    keyCodes,
    methods,
    objects,
    svg,
    svgInline,
    svgInlineMaskMissing,
    svgNamespace,
    then,
    version = $.fn.jquery.split('.'),
    versionMinor = parseFloat(version[1]),
    $test;

  if (versionMinor < 7) {
    $.error('Ninja UI VERSION requires jQuery 1.7 or higher.');
  }

  $('<link>', {
    rel: 'stylesheet/less',
    href: '../src/less/index.less',
    type: 'text/css'
  }).prependTo('head');

  $test = $('<div>').appendTo('body');
  $test.html('<svg>');
  svgNamespace = 'http://www.w3.org/2000/svg';
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

  keyCodes = {
    tab: 9,
    enter: 13,
    escape: 27,
    arrowLeft: 37,
    arrowUp: 38,
    arrowRight: 39,
    arrowDown: 40
  };

  function isKey(event, name) {
    return event.keyCode === keyCodes[name];
  }

  function inKeys(event, names) {
    var codes = $.map(names, function (name, i) {
      return keyCodes[name];
    });
    return $.inArray(event.keyCode, codes) > -1;
  }

  then = $.now();

  function uniqueId() {
    return then += 1;
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
        } else if ($object.is('.nui-slc') && !$object.is('.nui-dsb')) {
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
          $object.addClass('nui-dsb').trigger('disable.ninja');
        }
      });
    },

    enable: function (callback) {
      return this.each(function () {
        var $object = $(this).ninja();
        if ($.isFunction(callback)) {
          $object.bind('enable.ninja', callback);
        } else {
          $object.removeClass('nui-dsb').trigger('enable.ninja');
        }
      });
    },

    list: function (options) {
      return this.each(function () {
        options = $.extend({}, defaults, options);
        var
          $hover = null,
          $object = $(this).ninja(),
          $button = $object.find('button'),
          $input = $object.find('input'),
          $list = $('<div>', {
            'class': 'nui-lst'
          });
        if ($object.is('.nui-atc')) {
          $object.find('.nui-icn[aria-label=spin]').hide();
        }
        if (options.values.length) {
          $object.bind({
            'delist.ninja': function () {
              $(document).unbind('click.ninja keydown.ninja keyup.ninja');
              $list.detach();
              if ($hover) {
                $hover.removeClass('nui-hvr');
              }
            }
          });
          $object.append($list);
          $(document).bind({
            'keydown.ninja': function (event) {
              if (inKeys(event, ['arrowDown', 'arrowUp', 'tab'])) {
                event.preventDefault();
              }
            },
            'keyup.ninja': function (event) {
              if (inKeys(event, ['arrowDown', 'arrowUp', 'enter', 'escape', 'tab'])) {
                if (isKey(event, 'enter')) {
                  if ($hover) {
                    $hover.click();
                  }
                } else if (isKey(event, 'escape')) {
                  $object.delist();
                } else if (inKeys(event, ['arrowDown', 'tab']) && !event.shiftKey) {
                  if ($hover) {
                    if ($hover.nextAll('.nui-itm').length) {
                      $hover.nextAll('.nui-itm:first').trigger('mouseenter.ninja');
                    } else {
                      $list.find('.nui-itm:first').trigger('mouseenter.ninja');
                    }
                  } else {
                    $list.find('.nui-itm:first').trigger('mouseenter.ninja');
                  }
                } else if (isKey(event, 'arrowUp') || (event.shiftKey && isKey(event, 'tab'))) {
                  if ($hover) {
                    if ($hover.prevAll('.nui-itm').length) {
                      $hover.prevAll('.nui-itm:first').trigger('mouseenter.ninja');
                    } else {
                      $list.find('.nui-itm:last').trigger('mouseenter.ninja');
                    }
                  } else {
                    $list.find('.nui-itm:last').trigger('mouseenter.ninja');
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
            options.values = $.map(options.values, function (item) {
              item.value = item.value  || item.html || item;
              if (item.html) {
                item.html = item.html.toString().replace(new RegExp(options.query, 'gi'), '<b>' + options.query + '</b>');
              }
              return item;
            });
          }
          $.each(options.values, function (i, value) {
            var $value;
            if (value.rule) {
              $value = $('<div>', {
                'class': 'nui-rul'
              });
            } else {
              $value = $('<button>', {
                'class': 'nui-itm'
              });
              $value.bind({
                'mouseleave.ninja': function () {
                  $hover.removeClass('nui-hvr');
                },
                'click.ninja': function () {
                  if ($button) {
                    $button.focus();
                  }
                  if ($input) {
                    $input.val(value.value || value.html || value).focus();
                  }
                  if ($.isFunction(value.select)) {
                    value.select();
                  }
                },
                'mouseenter.ninja': function () {
                  if ($button) {
                    $button.blur();
                  }
                  if ($hover) {
                    $hover.trigger('mouseleave.ninja');
                  }
                  $hover = $value.addClass('nui-hvr');
                }
              });
            }
            $value.html(value.html || value).appendTo($list);
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
                  $object.addClass('nui-plc');
                  if (value === '') {
                    $object.val(placeholder);
                  }
                }
              },
              'focus.ninja': function () {
                if ($object.val() === placeholder) {
                  $object.removeClass('nui-plc').val('');
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
        } else if (!$object.is('.nui-dsb')) {
          $object.trigger('select.ninja');
        }
      });
    },

    values: function (callback) {
      return this.each(function () {
        var $object = $(this).ninja();
        if ($.isFunction(callback)) {
          $object.bind('values.ninja', callback);
        } else if ($object.val() !== '') {
          $object.trigger('values.ninja');
        }
      });
    }

  };

  objects = {

    autocomplete: function (options) {
      options = $.extend({}, defaults, options);
      var
        timer,
        $spin = $.ninja.icon({
          value: 'spin'
        }).hide(),
        $input = $('<input>', {
          type: 'text'
        }).bind({
          'keyup.ninja': function (event) {
            clearTimeout(timer);
            if (!inKeys(event, ['arrowDown', 'arrowLeft', 'arrowRight', 'arrowUp', 'enter', 'escape', 'tab']) && $input.val() !== '') {
              timer = setTimeout(function () {
                $spin.show();
                $input.values();
              }, 1000);
            }
          }
        }),
        $autocomplete = $('<span>', {
          'class': 'nui-atc'
        }).bind({
          'select.ninja': function (event) {
            if (event.html) {
              $input.val($.trim(event.html.toString().replace(new RegExp('/<\/?[^>]+>/', 'gi'), '')));
            } else {
              event.html = $input.val();
            }
          },
          'values.ninja': function (event) {
            $input.delist();
            event.query = $input.val();
          }
        });
      $autocomplete.append($input, $spin);
      if (options.placeholder) {
        $input.ninja().placeholder(options.placeholder);
      }
      return $autocomplete.ninja();
    },

    button: function (options) {
      options = $.extend({}, defaults, options);
      var $button = $('<button>', {
        'class': 'nui-btn',
        css: options.css,
        html: options.html
      });
      $button.bind({
        'click.ninja': function (event) {
          if (!$button.is('.nui-dsb')) {
            if ($button.is('.nui-slc')) {
              $button.trigger('deselect.ninja');
            } else {
              $button.trigger('select.ninja');
            }
          }
          event.stopImmediatePropagation();
        },
        'deselect.ninja': function () {
          $button.removeClass('nui-slc');
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
          $button.addClass('nui-slc');
        }
      });
      if (options.select) {
        $button.trigger('select.ninja');
      }
      if (options.disable) {
        $button.addClass('nui-dsb');
        $button.trigger('disable.ninja');
      }
      return $button.ninja();
    },

    dialog: function (options) {
      options = $.extend({}, defaults, {
        $parent: $('body')
      }, options);
      var
        $dialog = $('<span>', {
          'class': 'nui-dlg',
          css: options.css,
          html: options.html
        }),
        $blocker = $('<div>', {
          'class': 'nui-blk'
        }).bind('click.ninja', function (event) {
          if ($.inArray($dialog[0], $(event.target).parents()) === -1) {
            $dialog.detach();
          }
        });
      $.ninja.icon({
        value: 'X'
      }).bind('click.ninja', function () {
        $dialog.detach();
      }).appendTo($dialog);
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
              if (isKey(event, 'escape')) {
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
        $drawer = $('<div>', {
          'class': 'nui-drw'
        }),
        $tray = $('<div>', {
          'class': 'nui-try',
          html: options.html
        }).appendTo($drawer),
        $arrowDown = $.ninja.icon({
          value: 'arrow-down'
        }),
        $arrowRight = $.ninja.icon({
          value: 'arrow-right'
        }),
        $handle = $.ninja.button($.extend({}, options, {
          select: options.select,
          html: options.value
        })).bind({
          'deselect.ninja': function () {
            $tray.slideUp('fast', function () {
              $arrowDown.remove();
              $arrowRight.prependTo($handle);
            });
          },
          'select.ninja': function () {
            $arrowRight.remove();
            $arrowDown.prependTo($handle);
            $tray.slideDown('fast');
          }
        }).prependTo($drawer);
      if (options.select) {
        $arrowDown.prependTo($handle);
      } else {
        $tray.hide();
        $arrowRight.prependTo($handle);
      }
      return $drawer.ninja();
    },

    icon: function (options) {
      options = $.extend({}, defaults, {
        value: 'spin'
      }, options);
      var
        id = uniqueId(),
        idMask = 'mask' + id,
        mask,
        $circle = $('<circle>'),
        $defs = $('<defs>'),
        $g = $('<g>', {
          'stroke-width': 0
        }),
        $icon,
        $rect = $('<rect>'),
        $mask = $('<mask>', {
          id: idMask
        }).append($rect.clone().attr({
          fill: '#fff',
          height: 16,
          width: 16
        })),
        $polygon = $('<polygon>'),
        $svg = $('<svg>', {
          'aria-label': options.value,
          'class': 'nui-icn',
          role: 'img',
          version: '1.1',
          viewBox: '0 0 16 16',
          xmlns: 'http://www.w3.org/2000/svg'
        }).attr({
          height: 16,
          width: 16
        });
      if ($.inArray(options.value, ['-', '+', 'camera', 'x']) > -1) {
        mask = true;
        $mask.appendTo($defs);
      }
      if ($.inArray(options.value, ['arrow-down', 'arrow-right']) > -1) {
        if (options.value === 'arrow-down') {
          $polygon.attr('points', '4,4 12,4 8,12').appendTo($g);
        } else {
          $polygon.attr('points', '4,4 12,8 4,12').appendTo($g);
        }
      } else if (options.value === 'camera') {
        $circle.clone().attr({
          cx: 8,
          cy: 9,
          r: 5
        }).appendTo($mask);
        $rect.attr({
          height: 11,
          mask: 'url(#' + idMask + ')',
          rx: 2,
          ry: 2,
          width: 16,
          x: 0,
          y: 4
        }).appendTo($g);
        $polygon.attr({
          mask: 'url(#' + idMask + ')',
          points: '4,8 4,4 6,1 10,1 12,4 12,8'
        }).appendTo($g);
        $circle.attr({
          cx: 8,
          cy: 9,
          r: 3
        }).appendTo($g);
      } else if ($.inArray(options.value, ['X', 'x', '-', '+']) > -1) {
        if (options.value === '-') {
          $rect.clone().attr({
            height: 2,
            width: 8,
            x: 4,
            y: 7
          }).appendTo($mask);
        } else {
          $polygon.attr('points', '7,4 9,4 9,7 12,7 12,9 9,9 9,12 7,12 7,9 4,9 4,7 7,7').appendTo($mask);
          if (options.value !== '+') {
            $polygon.attr('transform', 'rotate(45 8 8)');
          }
        }
        $circle.attr({
          cx: 8,
          cy: 8
        }).appendTo($g);
        if (options.value === 'X') {
          $circle.attr({
            r: 7,
            'stroke-width': 1
          });
          $polygon.clone().attr('fill', '#fff').appendTo($g);
        } else {
          $circle.attr({
            mask: 'url(#' + idMask + ')',
            r: 8
          });
        }
      } else if (options.value === 'email') {
        $polygon.clone().attr({
          points: '0,2 8,10 16,2'
        }).appendTo($g);
        $polygon.clone().attr({
          points: '16,4 12,8 16,12'
        }).appendTo($g);
        $polygon.clone().attr({
          points: '0,14 5,9 8,12 11,9 16,14'
        }).appendTo($g);
        $polygon.attr({
          points: '0,4 4,8 0,12'
        }).appendTo($g);
      } else if (options.value === 'go') {
        $circle.attr({
          cx: 8,
          cy: 8
        }).appendTo($g);
        $circle.clone().attr({
          fill: 'none',
          'stroke-width': 2,
          r: 7
        }).appendTo($g);
        $circle.attr({
          r: 5
        }).appendTo($g);
      } else if (options.value === 'home') {
        $polygon.attr('points', '0,10 0,8 8,0 16,8 16,10 14,10 14,16 10,16 10,10 6,10 6,16 2,16 2,10').appendTo($g);
        $rect.attr({
          height: 8,
          width: 4,
          x: 10,
          y: 0
        }).appendTo($g);
      } else if (options.value === 'search') {
        $circle.attr({
          cx: 7,
          cy: 7,
          fill: 'none',
          r: 5,
          'stroke-width': 2
        }).appendTo($g);
        $polygon.attr('points', '9,11 11,9 16,14 14,16').appendTo($g);
      } else if (options.value === 'star') {
        $polygon.attr({
          points: '0,6 6,6 8,0 10,6 16,6 11,10 13,16 8,12 3,16 5,10',
          'stroke-width': 1
        }).appendTo($g);
      } else if (options.value === 'stop') {
        $rect.clone().attr({
          fill: 'none',
          height: 14,
          'stroke-width': 2,
          width: 14,
          x: 1,
          y: 1
        }).appendTo($g);
        $rect.attr({
          height: 10,
          width: 10,
          x: 3,
          y: 3
        }).appendTo($g);
      } else if (options.value === 'yield') {
        $polygon.clone().attr({
          fill: 'none',
          points: '8,1 15,15 1,15',
          'stroke-width': 2
        }).appendTo($g);
        $polygon.attr('points', '8,5 12,13 4,13').appendTo($g);
      } else if (options.value === 'spin') {
        $rect.attr({
          height: 4,
          width: 2,
          x: 7
        }).appendTo($g);
        $rect.clone().attr({
          style: 'opacity:.1',
          transform: 'rotate(30 8 8)'
        }).appendTo($g);
        $rect.clone().attr({
          style: 'opacity:.2',
          transform: 'rotate(60 8 8)'
        }).appendTo($g);
        $rect.clone().attr({
          style: 'opacity:.3',
          transform: 'rotate(90 8 8)'
        }).appendTo($g);
        $rect.clone().attr({
          style: 'opacity:.4',
          transform: 'rotate(120 8 8)'
        }).appendTo($g);
        $rect.clone().attr({
          style: 'opacity:.5',
          transform: 'rotate(150 8 8)'
        }).appendTo($g);
        $rect.clone().attr({
          style: 'opacity:.6',
          transform: 'rotate(180 8 8)'
        }).appendTo($g);
        $rect.clone().attr({
          style: 'opacity:.7',
          transform: 'rotate(210 8 8)'
        }).appendTo($g);
        $rect.clone().attr({
          style: 'opacity:.8',
          transform: 'rotate(240 8 8)'
        }).appendTo($g);
        $rect.clone().attr({
          style: 'opacity:.9',
          transform: 'rotate(270 8 8)'
        }).appendTo($g);
        $rect.clone().attr({
          style: 'opacity:.95',
          transform: 'rotate(300 8 8)'
        }).appendTo($g);
        $rect.clone().attr({
          style: 'opacity:.975',
          transform: 'rotate(330 8 8)'
        }).appendTo($g);
      }
      if (options.css) {
        $g.css(options.css);
      }
      $svg.append('<title>' + options.value + '</title>', $defs, $g);
      if (svgInline && (!mask || mask && !svgInlineMaskMissing)) {
        $icon = $($('<div>').append($svg).html());
        if (options.value === 'spin') {
          $icon.bind({
            'spin.ninja': function () {
              var frame = 0;
              setInterval(function () {
                frame = frame + 30;
                if (frame === 360) {
                  frame = 0;
                }
                $icon.find('g').attr('transform', 'rotate(' + frame + ' 8 8)');
              }, 100);
            }
          }).trigger('spin.ninja');
        }
        return $icon;
      } else if (svg) {
        $g.attr({
          fill: '#333',
          stroke: '#333'
        });
        return $('<img>', {
          'aria-label': options.value,
          'class': 'nui-icn',
          src: 'data:image/svg+xml;base64,' + window.btoa((new XMLSerializer()).serializeToString($svg[0]))
        });
      } else {
        return $('<span>', {
          'aria-label': options.value,
          'class': 'nui-icn'
        });
      }
    },

    menu: function (options) {
      options = $.extend({}, defaults, options);
      var
        $arrowDown = $.ninja.icon({
          value: 'arrow-down'
        }),
        $menu = $('<span>', {
          'class': 'nui-mnu'
        }),
        $button = $.ninja.button($.extend({}, options, {
          html: options.html
        })).select(function () {
          $menu.list(options);
        }).deselect(function () {
          $menu.delist();
        }).append($arrowDown);
      $menu.bind({
        'delist.ninja': function () {
          $button.deselect();
        }
      }).append($button);
      return $menu.ninja();
    },

    rating: function (options) {
      options = $.extend({}, defaults, {
        average: 0,
        individual: 0,
        values: 5
      }, options);
      var
        i,
        $rating = $('<span>', {
          'class': 'nui-rtn'
        }).bind({
          'mouseleave.ninja': function () {
            $rating.find('.nui-str').each(function (ii, star) {
              var $star = $(star);
              if (options.individual === 0) {
                if (ii < options.average) {
                  $star.addClass('nui-avg');
                } else {
                  $star.removeClass('nui-avg');
                }
              }
              if (ii < options.individual) {
                $star.addClass('nui-ind');
              } else {
                $star.removeClass('nui-ind');
              }
            });
          }
        });
      for (i = 0; i < options.values; i += 1) {
        $('<button>', {
          'class': 'nui-str',
          html: $.ninja.icon({
            value: 'star'
          })
        }).appendTo($rating);
      }
      $rating.find('.nui-str').each(function (i, star) {
        i += 1;
        var $star = $(star);
        $star.bind({
          'click.ninja select.ninja': function () {
            options.individual = i;
            $rating.trigger('mouseleave.ninja').trigger({
              type: 'select',
              value: i
            });
          },
          'mouseenter.ninja': function () {
            $rating.find('.nui-str').each(function (ii, star) {
              var $star = $(star).removeClass('nui-avg');
              if (ii < i) {
                $star.addClass('nui-ind');
              } else {
                $star.removeClass('nui-ind');
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
        value: 0,
        width: 200
      }, options);
      if (options.value < 0) {
        options.value = 0;
      } else if (options.value > (options.values.length - 1)) {
        options.value = options.values.length - 1;
      }
      var
        drag = false,
        offsetX = 0,
        touch,
        slots = options.values.length - 1,
        increment = options.width / slots,
        left = options.value * increment,
        $value = $('<span>', {
          'class': 'nui-sld-value',
          html: options.values[options.value].html
        }),
        $button = $('<button>', {
          'class': 'nui-sld-btn',
          css: { left: left }
        }),
        trackWidth = options.width + 18,
        $level = $('<div>', {
          'class': 'nui-sld-lvl',
          css: { width: left }
        }),
        $slider = $('<span>', {
          'class': 'nui-sld'
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
            event.value = options.values[slot];
            $value.html(event.value.html);
            left = slot * increment;
            $button.css({ left: left });
            $level.css({ width: left });
          },
          'select.ninja': function (event) {
            if (event.value.select) {
              event.value.select(event);
            }
          }
        }).append($value),
        $track = $('<div>', {
          'class': 'nui-sld-trk',
          css: { width: trackWidth }
        }).appendTo($slider),
        $groove = $('<div>', {
          'class': 'nui-sld-grv'
        }).bind('click.ninja', function (event) {
          $button.trigger({
            type: 'select.ninja',
            sliderX: Math.round((event.pageX - $track.offset().left) / increment)
          });
        });
      $track.append($groove.append($level), $button);
      if (options.html) {
        $value.before($('<span>', {
          'class': 'nui-sld-ttl',
          html: options.html + ': '
        }));
      }
      $button.bind({
        'keyup.ninja': function (event) {
          if (inKeys(event, ['arrowLeft', 'arrowRight'])) {
            var
              value,
              slot = Math.round($button.position().left / increment);
            if (slot > 0 && isKey(event, 'arrowLeft')) {
              slot -= 1;
            } else if (slot < slots && isKey(event, 'arrowRight')) {
              slot += 1;
            }
            value = options.values[slot];
            $value.html(value.html);
            left = slot * increment;
            $button.css({ left: left });
            $level.css({ width: left });
            return false;
          }
        },
        'mousedown.ninja touchstart.ninja': function (event) {
          event.preventDefault();
          $button.addClass('nui-slc');
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
              $button.removeClass('nui-slc');
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
          $button.removeClass('nui-slc').trigger({
            type: 'select.ninja',
            sliderX: Math.round((touch.pageX - offsetX) / increment)
          });
        }
      });
      return $slider.ninja();
    },

    tabs: function (options) {
      options = $.extend({}, defaults, {
        value: 1
      }, options);
      var $tabs = $('<span>');
      if (options.vertical) {
        $tabs.addClass('nui-tab-vrt');
      } else {
        $tabs.addClass('nui-tab-hrz');
      }
      $.each(options.values, function (i, value) {
        var $tab = $('<button>', {
          'class': 'nui-tab',
          css: options.css,
          html: value.html || value
        }).bind({
          'click.ninja': function () {
            if (!$tab.is('.nui-dsb') && !$tab.is('.nui-slc')) {
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
            $tabs.children().not($tab).removeClass('nui-slc');
            $tab.addClass('nui-slc');
            if ($.isFunction(value.select)) {
              value.select();
            }
          }
        }).appendTo($tabs);
        if (i === options.value - 1) {
          $tab.select();
        }
      });
      return $tabs.ninja();
    },

    version: function () {
      return 'VERSION';
    }

  };

  $.ninja = objects;

  $.fn.ninja = function () {
    return this.extend(methods);
  };

}(jQuery, window, document));
