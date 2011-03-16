/*copyright
  Ninja UI 1.0.alpha.1, http://ninjaui.com/
  Copyright 2010-2011, Jamie Hoover
  Requires jQuery 1.4.4, http://jquery.com/
*/

/*global
  jQuery: false
*/

/*jshint
  bitwise: true,
  browser: true,
  eqeqeq: true,
  indent: 2,
  newcap: true,
  nomen: true,
  regexp: true,
  undef: true,
  white: true
*/

(function ($) {

  /* jQuery 1.5 sub function made backwards compatible */
  if (!$.sub) {
    $.sub = function () {
      function jQuerySubclass(selector, context) {
        return new jQuerySubclass.fn.init(selector, context);
      }
      $.extend(true, jQuerySubclass, this);
      jQuerySubclass.superclass = this;
      jQuerySubclass.fn = jQuerySubclass.prototype = this();
      jQuerySubclass.fn.constructor = jQuerySubclass;
      jQuerySubclass.subclass = this.subclass;
      var rootjQuerySubclass;
      jQuerySubclass.fn.init = function init(selector, context) {
        if (context && context instanceof jQuery && !(context instanceof jQuerySubclass)) {
          context = jQuerySubclass(context);
        }
        return $.fn.init.call(this, selector, context, rootjQuerySubclass);
      };
      jQuerySubclass.fn.init.prototype = jQuerySubclass.fn;
      rootjQuerySubclass = jQuerySubclass(document);
      return jQuerySubclass;
    };
  }

  var ninja = $.sub();

  ninja.fn.extend({

    /* Bubble - container layer object, positioned under calling object, dismissed via ninja().pop() or the escape key.
      ninja().bubble({
        pop: true - adds a button (x) to dismiss.
        radius: '0.5em' custom radius for the bubble, see ninja().radius().
        theme: 'light' | 'dark' | 'etc' - custom theme for the bubble, see ninja().themeToggle().
        window: true - center ninja bubble within browser window
      })
    */
    bubble: function (options) {
      options = $.extend({
        pop: false,
        radius: '0.25em',
        theme: 'light',
        window: false
      }, options);
      var
      $object = this,
      $bubble = ninja('<span/>', {
        className: 'ninja ninjaBorder ninjaBubble ninjaInline ninjaShadow'
      }).hide();
      if (options.theme) {
        $bubble.themeToggle(options.theme);
      }
      if (options.css) {
        $bubble.css(options.css);
      }
      if (options.radius) {
        $bubble.round({
          radius: options.radius
        });
      }
      $bubble.bind({
        'update.ninja': function (event) {
          $bubble.html(event.html).ready(function () {
            $(document.body).append($bubble);
            if (options.window) {
              $bubble.css({
                left: ($(window).width() / 2) - ($bubble.outerWidth() / 2),
                top: ($(window).height() / 2) - ($bubble.outerHeight() / 2)
              });
            }
            else {
              var position = $object.position();
              if (position.top + $bubble.outerHeight() > $(window).height()) {
                $bubble.css({
                  bottom: 0
                });
              }
              else {
                $bubble.css({
                  top: position.top + $object.outerHeight()
                });
              }
              if (position.left + $bubble.outerWidth() > $(window).width()) {
                $bubble.css({
                  right: 0
                });
              }
              else {
                $bubble.css({
                  left: position.left
                });
              }
              var $stem = $.ninja().icon('arrowUp').addClass('ninjaBubbleStem').css({
                left: $object.outerWidth() / 2
              });
              $bubble.append($stem);
            }
            if (options.pop) {
              var $pop = $.ninja().icon('xAlt').addClass('ninjaBubblePop ninjaShadow').bind('click.ninja', function () {
                $bubble.pop();
              }).round({
                radius: '1em'
              });
              $bubble.append($pop);
            }
            if ($bubble.is(':hidden')) {
              $bubble.fadeIn('fast');
              $(document).bind('keydown.ninja', function (event) {
                if (event.keyCode === 27) {
                  $bubble.pop();
                  $(document).unbind('keydown.ninja');
                }
              });
            }
          });
        },
        'pop.ninja': function () {
          $bubble.fadeOut('fast', function () {
            $bubble.remove();
            if ($object.is('.ninjaButton')) {
              $object.deselect();
            }
          });
        }
      });
      if (options.html) {
        $bubble.update(options.html);
      }
      return $bubble;
    },
    
    /* Button - ninja object that can be enabled/disabled or selected/deselected by the user or a function.
      ninja().bubble({
        enable: false - disable the ninja button by default.
        radius: '0.5em' custom radius for the bubble, see ninja().radius().
        select: true - select the ninja button by default.
        theme: 'light' | 'dark' | 'etc' - custom theme for the bubble, see ninja().themeToggle().
      })
    */
    button: function (options) {
      options = $.extend({
        enable: true,
        gradient: true,
        radius: '0.25em',
        theme: 'light'
      }, options);
      var $button = ninja('<span/>', {
        className: 'ninja ninjaBorder ninjaButton ninjaInline ninjaUnselectable'
      });
      if (options.gradient) {
        $button.addClass('ninjaGradient');
      }
      if (options.radius) {
        $button.round({
          radius: options.radius
        });
      }
      if (options.html) {
        $button.html(options.html);
      }
      if (options.theme) {
        $button.themeToggle(options.theme);
      }
      if (options.css) {
        $button.css(options.css);
      }
      $button.bind({
        'click.ninja': function (event) {
          if ($button.is('.ninjaSelected')) {
            $button.ninja().deselect();
          }
          else {
            $button.select(event);
          }
        },
        'mouseenter.ninja mouseleave.ninja': function () {
          $button.toggleClass('ninjaHovered');
        },
        'update.ninja': function (event) {
          $button.html(event.html);
        }
      });
      if (options.select) {
        $button.select();
      }
      return $button;
    },
    
    /* Capitalize - capitalize the initial character of a word.
      ninja().capitalize('word')
    */
    capitalize: function (word) {
      return word.replace(/^\w/, function (character) {
        return character.toUpperCase();
      });
    },

    /* Change - event when a suggest value changes.
      ninja().keyup()
    */
    change: function (options) {
      return this.each(function () {
        var $object = $(this);
        if ($object.is('.ninjaSuggest')) {
          var $input = $('input.ninja', $object);
          var timer;
          if ($.isFunction(options)) {
            var checkValue = function (lastValue) {
              timer = setTimeout(function () {
                var currentValue = $input.val();
                if (currentValue !== lastValue && currentValue !== '' && currentValue !== options.placeholder) {
                  options(currentValue);
                  checkValue(currentValue);
                }
                else {
                  checkValue(currentValue);
                }
              }, 1000);
            };
            $input.bind({
              'focus.ninja': function () {
                var value = $input.val();
                if (value !== '') {
                  options(value);
                }
              },
              'keydown.ninja': function () {
                clearTimeout(timer);
                checkValue($input.val());
              }
            });
          }
        }
      });
    },
    
    create: function (element, options) {
      return this.each(function () {
        var $object = $(this);

        if (element === 'drawer') {
          var iconHandle = $('<span/>').ninja().create('icon', {
            icon: 'right',
            size: options.size
          }), handle = $('<div/>', {
            id: $object.attr('id')
          }).ninja().create('button', {
            onDeselect: function () {
              $(iconHandle).ninja().update({
                icon: 'right'
              });
              $object.slideUp('fast', function () {
                $(handle).ninja().round();
              });
            },
            onSelect: function () {
              $(iconHandle).ninja().update({ 
                icon: 'down'
              });
              $(handle).ninja().round({ corners: 'top' });
              $object.slideDown('fast');
            },
            isSelected: options.isSelected,
            title: options.title,
            width: options.width
          }).prepend(iconHandle, '&#160;');
          if (!options.isSelected) {
            $object.hide();
          }
          $object
            .removeAttr('id')
            .addClass('ninja ninjaBorder ninjaDrawer ninjaEditable')
            .css({
              width: options.width
            })
            .ninja().round({
              corners: 'bottom'
            })
            .before(handle);
          if (options.isSelected) {
            $(iconHandle).ninja().update({
              icon: 'down'
            });
            $(handle).ninja().round({ corners: 'top' });
          }
        }

        else if (element === 'rating') {
          $object.addClass('ninja ninjaInline ninjaRating ninjaUnselectable');
          $.each(options.values, function () {
            var $star = $('<span/>', {
              className: 'ninja ninjaIcon',
              fontSize: options.size
            });
            if (navigator.platform === 'Win32') {
              $star.css({
                fontFamily: 'Wingdings'
              }).html('&#0171');
            }
            else {
              $star.html('&#9733');
            }
            $object.append($star).css({
              textShadow: 'rgba(0,0,0,0.5) 0 1px 2px'
            });
          });
          var hover = function (selected) {
            $('.ninjaIcon', $object).each(function (i, icon) {
              if (selected + 1 > i) {
                $(icon).addClass('ninjaSelected').removeClass('ninjaSelectedGroup');
              }
              else if ($.inArray(options.selectedGroup, options.values) + 1 > i) {
                $(icon).addClass('ninjaSelectedGroup').removeClass('ninjaSelected');
              }
              else {
                $(icon).removeClass('ninjaSelected ninjaSelectedGroup');
              }
            });
          };
          $('.ninjaIcon', $object).each(function (i, icon) {
            hover($.inArray(options.selected, options.values));
            $(icon).mouseenter(function () {
              hover(i);
            }).click(function () {
              $object.ninja().select({ selected: options.values[i] });
            }).mouseleave(function () {
              hover($.inArray(options.selected, options.values));
            });
          });
        }

        else if (element === 'slider') {
          options = $.extend({
            value: options.values[0],
            width: 200
          }, options);
          $object.addClass('ninja ninjaInline ninjaSlider');
          var slots = options.values.length - 1;
          options.increment = options.width / slots;
          var track = $('<div/>', {
            className: 'ninja ninjaTrack'
          });
          options.slot = $.inArray(options.value, options.values);
          options.button = $('<span/>', {
            className: 'ninja ninjaBorder ninjaEnabled ninjaButton ninjaGradient ninjaInline'
          }).ninja().round({ radius: '0.8em' });
          options.level = $('<div/>', {
            className: 'ninja ninjaEnabled ninjaGradient ninjaLevel'
          }).ninja().round().width(options.slot * options.increment);
          options.name = options.names[options.slot] || options.value;
          options.status = $('<span/>', {
            className: 'ninja ninjaStatus',
            text: options.name
          });
          options.input = $('<input/>', {
            name: $object.attr('id') || options.title,
            type: 'hidden'
          });
          var label = $('<div/>', {
            className: 'ninja ninjaStatus ninjaUnselectable'
          }).append($(options.status));
          if (options.title) {
            $(label).prepend($('<span/>', {
              className: 'ninja ninjaTitle',
              text: options.title + ': '
            }));
          }
          $object.append($(label), $(options.input), $(track));
          $(track).append($(options.button)).css({ height: $(options.button).outerHeight() });
          var buttonRadius = Math.round($(options.button).outerWidth() / 2);
          $(label).css({
            marginLeft: buttonRadius,
            marginRight: buttonRadius
          });
          var buttonDiameter = buttonRadius * 2;
          var trackWidth = options.width + buttonDiameter;
          var groove = $('<div/>', {
            className: 'ninja ninjaBorder ninjaEnabled ninjaGradient ninjaGroove ninjaSelected'
          }).ninja().round().click(function (event) {
            var slot = function () {
              var x = Math.round((event.pageX - $(track).offset().left) / options.increment);
              if (x < 0) {
                return 0;
              }
              else if (x > slots) {
                return slots;
              }
              else {
                return x;
              }
            };
            options.value = options.values[slot()];
            $object.ninja().select();
          });
          $(track).width(trackWidth).prepend($(groove));
          $(options.button).css({ left: (options.slot * options.increment), padding: 0 });
          $(groove).append($(options.level)).css({
            marginLeft: buttonRadius,
            marginRight: buttonRadius,
            top: buttonRadius - ($(groove).outerHeight() / 2)
          });
          var
            drag = false,
            offsetX = 0;
          $(options.button).mousedown(function (event) {
            event.preventDefault();
            offsetX = event.pageX - $(options.button).position().left;
            drag = true;
            $(document).mouseup(function (event) {
              drag = false;
              $object.ninja().select();
              $(document).unbind('mouseup');
            }).mousemove(function (event) {
              if (!drag) {
                return;
              }
              var slot = function () {
                var x = Math.round((event.pageX - offsetX) / options.increment);
                if (x < 0) {
                  return 0;
                }
                else if (x > slots) {
                  return slots;
                }
                else {
                  return x;
                }
              };
              options.value = options.values[slot()];
              $object.ninja().update();
            });
          }).bind('touchstart', function (event) {
            event.preventDefault();
            var touch = event.originalEvent.targetTouches[0] || event.originalEvent.changedTouches[0];
            offsetX = touch.pageX - $(options.button).position().left;
          }).bind('touchmove', function (event) {
            event.preventDefault();
            var touch = event.originalEvent.targetTouches[0] || event.originalEvent.changedTouches[0];
            var slot = function () {
              var x = Math.round((touch.pageX - offsetX) / options.increment);
              if (x < 0) {
                return 0;
              }
              else if (x > slots) {
                return slots;
              }
              else {
                return x;
              }
            };
            options.value = options.values[slot()];
            $object.ninja().update();
          }).bind('touchend', function (event) {
            event.preventDefault();
            $object.ninja().select();
          });
        }

        else {
          $object.html('<!-- Ninja ui: Unknown type of element magic: ' + element + '-->');
        }

        if ($.inArray(element, ['drawer', 'rating', 'slider']) > -1) {
          options.element = element;
        }

        $object.data('options.ninja', options);

      });
    },

    deselect: function (options) {
      return this.each(function () {
        var $object = $(this);
        if ($.isFunction(options)) {
          $object.bind('deselect.ninja', options);
        }
        else if ($object.is('.ninjaSelected')) {
          $object.removeClass('ninjaSelected');
          $object.trigger('deselect.ninja');
        }
      });
    },

    disable: function (options) {
      return this.each(function () {
        var $object = $(this);
        if ($.isFunction(options)) {
          $object.bind('disable.ninja', options);
        }
        else {
          $object.animate({
            opacity: 0.5
          });
          var $shield = $('<div/>', {
            className: 'ninja ninjaUnselectable ninjaShield',
            css: {
              maxHeight: $(window).width(),
              maxWidth: $(window).width(),
              minHeight: $object.outerHeight() + 2,
              minWidth: $object.outerWidth() + 2,
            }
          }).bind('click.ninja mouseenter.ninja mouseleave.ninja', function () {
            return false;
          });
          $object.append($shield);
          $object.trigger('disable.ninja');
        }
      });
    },

    enable: function (options) {
      return this.each(function () {
        var $object = $(this).ninja();
        if ($.isFunction(options)) {
          $object.bind('enable.ninja', options);
        }
        else {
          $('.ninjaShield', $object).remove();
          $object.animate({
            opacity: 1
          });
          $object.trigger('enable.ninja');
        }
      });
    },

    /* Icon - ninja object that contains a symbol font character.
      ninja().icon({
        name: 'info' | 'magnifyingGlass' | 'etc' - custom symbol for the ninja icon.
      })
    */
    icon: function (name) {
      var icons = { home: '!', at: '@', quote: '"', quoteAlt: "'", arrowUp: '3', arrowRight: '4', arrowBottom: '5', arrowLeft: '6', arrowUpAlt: '#', arrowRightAlt: '$', arrowBottomAlt: '%', arrowLeftAlt: '^', move: '9', moveVertical: '8', moveHorizontal: '7', moveAlt: '(', moveVerticalAlt: '*', moveHorizontalAlt: '&', cursor: ')', plus: '+', plusAlt: '=', minus: '-', minusAlt: '_', newWindow: '1', dial: '2', lightBulb: '0', link: '/', image: '?', article: '>', readMore: '', headphones: ',', equalizer: '<', fullscreen: ':', exitFullscreen: ';', spin: '[', spinAlt: '{', moon: ']', sun: '}', mapPin: '\\', pin: '|', eyedropper: '~', denied: '`', calendar: 'a', calendarAlt: 'A', bolt: 'b', clock: 'c', document: 'd', book: 'e', bookAlt: 'E', magnifyingGlass: 'f', tag: 'g', heart: 'h', info: 'i', chat: 'j', chatAlt: 'J', key: 'k', unlocked: 'l', locked: 'L', mail: 'm', mailAlt: 'M', phone: 'n', box: 'o', pencil: 'p', pencilAlt: 'P', comment: 'q', commentAlt: 'Q', rss: 'r', star: 's', trash: 't', user: 'u', volume: 'v', mute: 'V', cog: 'w', cogAlt: 'W', x: 'x', xAlt: 'X', check: 'y', checkAlt: 'Y', beaker: 'z', beakerAlt: 'Z' };
      var $icon = ninja('<span/>', {
        className: 'ninja ninjaIcon ninjaInline',
        text: icons[name]
      });
      return $icon;
    },
    
    /* List - array of choice objects that call a common function, individual functions or a combination of both.
      ninja().list({
        choices: {
          html: $('<div/>', {
            text: 'Choose me!'
          }),
          select: function () {}
          },
          {
          html: $('<div/>', {
            text: 'No, choose me!'
          }),
          select: function () {} 
        }
      })
    */
    list: function (options) {
      options = $.extend({
        theme: 'light'
      }, options);
      var $object = this;
      var $list = ninja('<span/>', {
        className: 'ninja ninjaInline ninjaList'
      }).ninja().round();
      if (options.html) {
        $list.html(options.html);
      }
      if (options.theme) {
        $list.themeToggle(options.theme);
      }
      if (options.css) {
        $list.css(options.css);
      }
      $.each(options.choices, function (i, choice) {
        var $choice;
        if (choice.spacer) {
          $choice = $('<div/>', {
            className: 'ninja ninjaChoice',
            html: choice.html
          });
        }
        else {
          $choice = $.ninja().button({
            gradient: false,
            html: choice.html || choice
          }).addClass('ninjaChoice').select(function (event) {
            event.html = choice.html || choice;
            /* individual select function */
            if (choice.select) {
              choice.select();
            }
            $choice.deselect();
          });
        }
        $list.append($choice);
      });
      $(document).bind({
        'keydown.ninja': function (event) {
          if ($.inArray(event.keyCode, [38, 40]) > -1) {/* down or up */
            return false;
          }
        },
        'keyup.ninja': function (event) {
          if ($.inArray(event.keyCode, [13, 38, 40]) > -1) {/* return, down, up or esc */
            var $button = $('.ninjaHovered', $list);
            if (event.keyCode === 13) {/* return */
              $('.ninjaHovered', $list).select();
            }
            else if (event.keyCode === 40) {/* down arrow */
              if ($button.length) {
                $button.trigger('mouseleave.ninja');
                if ($button.nextAll('.ninjaButton').length) {
                  $button.nextAll('.ninjaButton:first').trigger('mouseenter.ninja');
                }
                else {
                  $('.ninjaButton:first', $list).trigger('mouseenter.ninja');
                }
              }
              else {
                $('.ninjaButton:first', $list).trigger('mouseenter.ninja');
              }
            }
            else if (event.keyCode === 38) {/* up arrow */
              if ($button.length) {
                $button
                  .trigger('mouseleave.ninja')
                  .prevAll('.ninjaButton:first').trigger('mouseenter');
              }
              else {
                $('.ninjaButton:last', $list).trigger('mouseenter');
              }
            }
            return false;
          }
        }
      });
      return $list;
    },
    
    /* Pop - remove a ninja bubble.
      ninja().pop()
    */
    pop: function () {
      this.each(function () {
        var $object = $(this);
        $object.trigger('pop.ninja');
      });
    },
    
    round: function (options) {
      return this.each(function () {
        var $object = $(this);
        options = $.extend({
          corners: null,
          radius: '0.25em'
        }, $object.data('options.ninja'), options);
        if (options.radius) {
          var radii;
          if (options.corners === 'bottom') {
            radii = [0, 0, options.radius, options.radius];
          }
          else if (options.corners === 'bottomLeft') {
            radii = [0, 0, 0, options.radius];
          }
          else if (options.corners === 'bottomRight') {
            radii = [0, 0, options.radius, 0];
          }
          else if (options.corners === 'left') {
            radii = [options.radius, 0, 0, options.radius];
          }
          else if (options.corners === 'right') {
            radii = [0, options.radius, options.radius, 0];
          }
          else if (options.corners === 'top') {
            radii = [options.radius, options.radius, 0, 0];
          }
          else if (options.corners === 'topLeft') {
            radii = [options.radius, 0, 0, 0];
          }
          else if (options.corners === 'topRight') {
            radii = [0, options.radius, 0, 0];
          }
          else {
            radii = [options.radius, options.radius, options.radius, options.radius];
          }
          var borderRadius = false,
            style = document.body.style;
          if (style.borderRadius !== undefined) {
            borderRadius = 'border';
          }
          else if (style.WebkitBorderRadius !== undefined) {
            borderRadius = '-webkit-border';
          }
          else if (style.MozBorderRadius !== undefined) {
            borderRadius = '-moz-border';
          }
          if (borderRadius && borderRadius === 'border') {
            if (radii[0] === radii[1] && radii[0] === radii[2] && radii[0] === radii[3]) {
              $object.css({
                'border-radius': radii[0]
              });
            }
            else {
              $object.css({
                'border-radius': radii.join(' ')
              });
            }
          }
          else if (borderRadius && borderRadius === '-moz-border') {
            $object.css({
              '-moz-border-radius-topleft': radii[0],
              '-moz-border-radius-topright': radii[1],
              '-moz-border-radius-bottomright': radii[2],
              '-moz-border-radius-bottomleft': radii[3]
            });
          }
          else if (borderRadius && borderRadius === '-webkit-border') {
            $object.css({
              '-webkit-border-top-left-radius': radii[0],
              '-webkit-border-top-right-radius': radii[1],
              '-webkit-border-bottom-right-radius': radii[2],
              '-webkit-border-bottom-left-radius': radii[3]
            });
          }
        }
      });
    },

    select: function (options) {
      return this.each(function () {
        var $object = $(this);
        
        if ($.isFunction(options)) {
          $object.bind('select.ninja', options);
        }
        
        else if (!$object.is('.ninjaSelected')) {
          $object.addClass('ninjaSelected');
          $object.trigger('select.ninja', options);
        }

      });
    },

    /*
      loops movement of background image
    */
    spin: function (options) {
      options = $.extend({
        frames: 12,
        frame: 0,
        increment: 16,
        speed: 100
      }, options);
      return this.each(function () {
        var $object = $(this);
        function advance() {
          $object.css({
            backgroundPosition: (options.frame * -(options.increment)) + 'px center'
          });
          options.frame++;
          if (options.frame === options.frames) {
            options.frame = 0;
          }
        }
        setInterval(function () {
          advance();
        }, options.speed);
      });
    },

    /* Suggest - ninja object that can be enabled/disabled or selected/deselected by the user or a function.
      ninja().bubble({
        enable: false - disable the ninja button by default.
        radius: '0.5em' custom radius for the bubble, see ninja().radius().
        select: true - select the ninja button by default.
        theme: 'light' | 'dark' | 'etc' - custom theme for the bubble, see ninja().themeToggle().
      })
    */
    suggest: function (options) {
      options = $.extend({
        radius: '0.25em',
        theme: 'light'
      }, options);
      var $suggest = ninja('<span/>', {
        className: 'ninja ninjaBorder ninjaEditable ninjaInline ninjaSuggest'
      });
      if (options.html) {
        $suggest.prepend(options.html);
      }
      if (options.theme) {
        $suggest.themeToggle(options.theme);
      }
      if (options.css) {
        $suggest.css(options.css);
      }
      if (options.radius) {
        $suggest.round({
          radius: options.radius
        });
      }
      var $input = $('<input/>', {
        className: 'ninja',
        type: 'text'
      });
      if (options.placeholder) {
        $input.css({
          opacity: 0.25
        }).val(options.placeholder).trigger('focus.ninja');
      }
      var $clear = $.ninja().icon('xAlt').addClass('ninjaSuggestClear').bind('click.ninja', function () {
        $input.val('').trigger('focus.ninja');
        $clear.detach();
      });
      $input.bind({
        'focus.ninja': function () {
          if (options.placeholder && $input.val() === options.placeholder) {
            $input.css({
              opacity: 1
            }).val('').trigger('focus.ninja');
          }
        },
        'blur.ninja': function () {
          if (options.placeholder && $input.val() === '') {
            $input.css({
              opacity: 0.25
            }).val(options.placeholder).trigger('keydown.ninja');
          }
          var $bubble = $suggest.data('bubble.ninja');
          if ($bubble) {
            $bubble.detach();
          }
        },
        'keydown.ninja': function (event) {
          if ($.inArray(event.keyCode, [48, 56, 57, 219, 220]) > -1) {/* metacharacters */
            return false;
          }
          else if (event.keyCode === 8 && $input.val().length === 1) {/* delete last character */
            $clear.detach();
            $suggest.data('bubble.ninja').detach();
          }
        },
        'keyup.ninja': function (event) {
          if ($.inArray(event.keyCode, [13, 27, 38, 40]) === -1) {/* not return, escape, down nor up */
            event.value = $input.val();
            if ($input.val().length) {
              $suggest.append($clear);
            }
          }
        }
      });
      $suggest.append($input);
      $suggest.bind({
        'update.ninja': function (event) {
          var $bubble = $suggest.data('bubble.ninja');
          if (!$bubble) {
            $suggest.data({
              'bubble.ninja': $suggest.bubble({
                html: event.html
              })
            });
          }
          else {
            $bubble.update(event.html);
          }
          var value = $input.val();
          $('.ninjaButton.ninjaChoice', $bubble).each(function (i, choice) {
            var $choice = $(choice);
            $choice.html($choice.html().replace(new RegExp(value, 'gi'), '<strong>' + value + '</strong>'));
          });
        }
      });
      return $suggest;
    },
    
    themeToggle: function (name) {
      return this.each(function (object) {
        var $object = $(this);
        $object.toggleClass('ninjaTheme' + ninja().capitalize(name));
      });
    },

    /* Update - replace the inner html of a ninja object.
      ninja().update('Your HTML/text here.')
    */
    update: function (html) {
      return this.each(function () {
        var $object = $(this);
        $object.trigger({
          type: 'update.ninja',
          html: html
        });

        var options = $.extend($object.data('options.ninja'), options);
        if (options.element === 'slider') {
          options.slot = $.inArray(options.value, options.values);
          options.name = options.names[options.slot] || options.value;
          $(options.button).css({ left: (options.slot * options.increment) + 'px' });
          $(options.level).width(options.slot * options.increment + 'px');
          $(options.status).text(options.name);
          if (options.onUpdate) {
            options.onUpdate.call(options);
          }
        }
      });
    },
    
  });
  
  $.ninja = function () {
    return ninja();
  };
  
  $.fn.ninja = function () {
    return ninja(this);
  };
  
}(jQuery));