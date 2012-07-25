/*
  Ninja User Interface jQuery Plugin VERSION
  http://ninjaui.com/
  Copyright 2008-YEAR Jamie Hoover
  Licensed per the terms of the Apache License v2.0
  http://ninjaui.com/#license
*/

(function ($) {

  'use strict';

  function Plugin() {
    this.version = parseFloat($.fn.jquery);
    this.uniqueId = $.now();
    this.keyCodes = {
      arrowDown: 40,
      arrowLeft: 37,
      arrowRight: 39,
      arrowUp: 38,
      enter: 13,
      escape: 27,
      tab: 9
    };
    this.svg = {
      namespaceURI: 'http://www.w3.org/2000/svg',
      inline: false,
      file: false,
      mask: true
    };
  }

  Plugin.prototype.require = function (version) {
    if (this.version < parseFloat(version)) {
      throw new Error('jQuery ' + version + ' or higher is required.');
    }
  };

  Plugin.prototype.checkSVG = function () {
    var svg = this.svg;

    $(function () {
      var $check = $('<div>').prependTo('body');

      $check.html('<svg>');

      if ($check.find('svg')[0] && $check.find('svg')[0].namespaceURI === svg.namespaceURI) {
        svg.inline = true;
        svg.file = true;
        if ($.browser.safari && $.browser.version < 535) {
          svg.mask = false;
        }
      } else {
        svg.file = !!document.createElementNS && !!document.createElementNS(svg.namespaceURI, 'svg').createSVGRect;
      }

      $check.remove();
    });

    return svg;
  };

  Plugin.prototype.assignId = function () {
    return this.uniqueId += 1;
  };

  Plugin.prototype.isKey = function (event, name) {
    return event.keyCode === this.keyCodes[name];
  };

  Plugin.prototype.inKeys = function (event, names) {
    var
      plugin = this,
      codes = $.map(names, function (name, i) {
        return plugin.keyCodes[name];
      });

    return $.inArray(event.keyCode, codes) > -1;
  };

  function Ninja() {}

  var
    plugin = new Plugin(),
    svg = plugin.checkSVG();

  plugin.require(1.7);

  Ninja.prototype.placeholder = function (placeholder) {
    return this.each(function () {
      var
        $this = $(this),
        attr = 'placeholder',
        value;

      if ($this.is('input[type=search], input[type=text]')) {
        if (attr in this) {
          if (!$this.attr(attr)) {
            $this.attr(attr, placeholder);
          }
        } else {
          $this.on({
            'blur.ninja': function () {
              value = $this.val();
              if (value === '' || value === placeholder) {
                $this.addClass('nui-plc');
                if (value === '') {
                  $this.val(placeholder);
                }
              }
            },
            'focus.ninja': function () {
              if ($this.val() === placeholder) {
                $this.removeClass('nui-plc').val('');
              }
            }
          }).trigger('blur.ninja');
        }
      }
    });
  };

  Ninja.prototype.attach = function (callback) {
    return this.each(function () {
      var $this = $(this);

      if (callback) {
        if ($.isFunction(callback)) {
          $this.on('attach.ninja', callback);
        }
      } else {
        $this.trigger('attach.ninja');
      }
    });
  };

  Ninja.prototype.delist = function (callback) {
    return this.each(function () {
      var $this = $(this);

      if (callback) {
        if ($.isFunction(callback)) {
          $this.on('delist.ninja', callback);
        }
      } else {
        $this.trigger('delist.ninja');
      }
    });
  };

  Ninja.prototype.deselect = function (callback) {
    return this.each(function () {
      var $this = $(this);

      if (callback) {
        if ($.isFunction(callback)) {
          $this.on('deselect.ninja', callback);
        }
      } else if ($this.is('.nui-slc') && !$this.is('.nui-dsb')) {
        $this.trigger('deselect.ninja');
      }
    });
  };

  Ninja.prototype.detach = function (callback) {
    return this.each(function () {
      var $this = $(this);

      if (callback) {
        if ($.isFunction(callback)) {
          $this.on('detach.ninja', callback);
        }
      } else {
        $this.trigger('detach.ninja');
        $.fn.detach.apply($this);
      }
    });
  };

  Ninja.prototype.disable = function (callback) {
    return this.each(function () {
      var $this = $(this);

      if (callback) {
        if ($.isFunction(callback)) {
          $this.on('disable.ninja', callback);
        }
      } else {
        $this.addClass('nui-dsb').trigger('disable.ninja');
      }
    });
  };

  Ninja.prototype.enable = function (callback) {
    return this.each(function () {
      var $this = $(this);

      if (callback) {
        if ($.isFunction(callback)) {
          $this.on('enable.ninja', callback);
        }
      } else {
        $this.removeClass('nui-dsb').trigger('enable.ninja');
      }
    });
  };

  Ninja.prototype.get = function (callback) {
    return this.each(function () {
      var $this = $(this);

      if (callback) {
        if ($.isFunction(callback)) {
          $this.on('get.ninja', callback);
        }
      } else if ($this.val() !== '') {
        $this.trigger('get.ninja');
      }
    });
  };

  Ninja.prototype.list = function (options) {
    return this.each(function () {
      var
        $this = $(this),
        $button = $this.find('button'),
        $input = $this.find('input'),
        $list = $('<div>', {
          'class': 'nui-lst'
        }),
        $hover;

      if ($this.is('.nui-atc')) {
        $this.find('.nui-icn[aria-label=spin]').hide();
      }

      if (options.values.length) {
        $(document).on({
          'keydown.ninja': function (event) {
            if (plugin.inKeys(event, ['arrowDown', 'arrowUp', 'tab'])) {
              event.preventDefault();
            }
          },
          'keyup.ninja': function (event) {
            if (plugin.inKeys(event, ['arrowDown', 'arrowUp', 'enter', 'escape', 'tab'])) {
              if (plugin.isKey(event, 'enter')) {
                if ($hover) {
                  $hover.click();
                }
              } else if (plugin.isKey(event, 'escape')) {
                $this.delist();
              } else if (plugin.inKeys(event, ['arrowDown', 'tab']) && !event.shiftKey) {
                if ($hover) {
                  if ($hover.nextAll('.nui-itm').length) {
                    $hover.nextAll('.nui-itm:first').trigger('mouseenter.ninja');
                  } else {
                    $list.find('.nui-itm:first').trigger('mouseenter.ninja');
                  }
                } else {
                  $list.find('.nui-itm:first').trigger('mouseenter.ninja');
                }
              } else if (plugin.isKey(event, 'arrowUp') || (event.shiftKey && plugin.isKey(event, 'tab'))) {
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
            $this.delist();
          }
        });

        $this.delist(function () {
          $(document).off('click.ninja keydown.ninja keyup.ninja');

          $list.detach();

          if ($hover) {
            $hover.removeClass('nui-hvr');
          }
        }).append($list);

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
            $value.on({
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
            top: $this.outerHeight()
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
  };

  Ninja.prototype.select = function (callback) {
    return this.each(function () {
      var $this = $(this);

      if (callback) {
        if ($.isFunction(callback)) {
          $this.on('select.ninja', callback);
        }
      } else if (!$this.is('.nui-dsb')) {
        $this.trigger('select.ninja');
      }
    });
  };

  Ninja.prototype.assemble = function (options) {
    options = $.extend({}, options);

    return this.each(function () {
      var
        $this = $(this),
        $icon;

      switch (options.element) {

      case 'autocomplete':
        $icon = $.ninja.icon({
          value: 'spin'
        }).hide();

        $this.on({
          'keyup.ninja': function (event) {
            if (!plugin.inKeys(event, plugin.keyCodes) && $this.val() !== '') {
              setTimeout(function () {
                $icon.show();
                $this.ninja().get();
              }, 1000);
            }
          }
        }).wrap('<span class="nui-atc">').parent().on({
          'select.ninja': function (event) {
            if (event.html) {
              $this.val($.trim(event.html.toString().replace(new RegExp('/<\/?[^>]+>/', 'gi'), '')));
            } else {
              event.html = $this.val();
            }
          },
          'get.ninja': function (event) {
            $this.ninja().delist();
            event.query = $this.val();
          }
        }).append($icon);

        break;

      case 'button':
        $this.addClass('nui-btn').on({
          'click.ninja': function (event) {
            if (!$this.is('.nui-dsb')) {
              if ($this.is('.nui-slc')) {
                $this.trigger('deselect.ninja');
              } else {
                $this.trigger('select.ninja');
              }
            }
            event.stopImmediatePropagation();
          },
          'deselect.ninja': function () {
            $this.removeClass('nui-slc');
          },
          'disable.ninja': function () {
            $this.attr({
              disabled: 'disabled'
            });
          },
          'enable.ninja': function () {
            $this.attr({
              disabled: false
            });
          },
          'select.ninja': function () {
            $this.addClass('nui-slc');
          }
        });

        if (options.select) {
          $this.trigger('select.ninja');
        }

        if (options.disable) {
          $this.addClass('nui-dsb');
          $this.trigger('disable.ninja');
        }

        break;

      case 'dialog':
        $this.addClass('nui-');
        break;

      case 'drawer':
        $this.addClass('nui-');
        break;

      case 'icon':
        $this.addClass('nui-');
        break;

      case 'menu':
        $this.addClass('nui-');
        break;

      case 'rating':
        $this.addClass('nui-');
        break;

      case 'slider':
        $this.addClass('nui-');
        break;

      case 'tabs':
        $this.addClass('nui-');
        break;

      }

    });
  };

  $.fn.ninja = function (element) {
    var $this = this.extend(new Ninja());

    if (element) {
      $this.assemble({
        element: element
      });
    }

    return $this;
  };

  $.ninja = {
    autocomplete: function (options) {
      options = $.extend({
        element: 'autocomplete'
      }, options);

      var $this = $('<input>').attr({
        type: 'text'
      });

      if (options.attr) {
        $this.attr(options.attr);
      }

      $this.ninja().assemble(options);

      if (options.placeholder) {
        $this.placeholder(options.placeholder);
      }

      return $this.parent();
    },

    button: function (options) {
      options = $.extend({
        element: 'button'
      }, options);

      var $this = $('<button>', {
        html: options.html
      });

      if (options.attr) {
        $this.attr(options.attr);
      }

      return $this.ninja().assemble(options);
    },

    dialog: function (options) {
      options = $.extend({}, {
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
        }).on('click.ninja', function (event) {
          if ($.inArray($dialog[0], $(event.target).parents()) === -1) {
            $dialog.detach();
          }
        });
      $.ninja.icon({
        value: 'X'
      }).on('click.ninja', function () {
        $dialog.detach();
      }).appendTo($dialog);
      $dialog.on({
        'attach.ninja': function (event) {
          options.$parent.append($blocker, $dialog);
          $blocker.height(options.$parent.height());
          $dialog.css({
            left: ($(window).width() / 2) - ($dialog.width() / 2),
            top: ($(window).height() / 2) - ($dialog.height() / 2) + $(window).scrollTop()
          });
          $(document).on({
            'keyup.ninja': function (event) {
              if (plugin.isKey(event, 'escape')) {
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
      options = $.extend({}, options);
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
        })).on({
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
      options = $.extend({}, {
        value: 'spin'
      }, options);
      var
        id = plugin.assignId(),
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
          xmlns: svg.namespaceURI
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
      if (svg.inline && (!mask || mask && svg.mask)) {
        $icon = $($('<div>').append($svg).html());
        if (options.value === 'spin') {
          $icon.on({
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
      } else if (svg.file) {
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
      options = $.extend({}, options);
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
      $menu.on({
        'delist.ninja': function () {
          $button.deselect();
        }
      }).append($button);
      return $menu.ninja();
    },

    rating: function (options) {
      options = $.extend({}, {
        average: 0,
        individual: 0,
        values: 5
      }, options);
      var
        i,
        $rating = $('<span>', {
          'class': 'nui-rtn'
        }).on({
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
        $star.on({
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
      options = $.extend({}, {
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
        }).on({
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
        }).on('click.ninja', function (event) {
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
      $button.on({
        'keyup.ninja': function (event) {
          if (plugin.inKeys(event, ['arrowLeft', 'arrowRight'])) {
            var
              value,
              slot = Math.round($button.position().left / increment);
            if (slot > 0 && plugin.isKey(event, 'arrowLeft')) {
              slot -= 1;
            } else if (slot < slots && plugin.isKey(event, 'arrowRight')) {
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
          $(document).on({
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
      options = $.extend({}, {
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
        }).on({
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
      return '1.1.0';
    }
  };
}(window.jQuery));
