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

  // Make jQuery 1.5 sub function backwards compatible
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

    animate: function (customOptions) {
      return this.each(function (i, object) {
        var options = $.extend({
          frames: 0,
          frameCurrent: 1,
          height: 16,
          speed: 100
        }, $(object).data('options'), customOptions);
        function scroll() {
          if (options.frameCurrent === options.frames) {
            options.frameCurrent = 0;
          }
          $(object).css('backgroundPosition', (options.frameCurrent * -(options.height)) + 'px center');
          options.frameCurrent++;
        }
        setInterval(function () {
          scroll();
        }, options.speed);
      });
    },

    create: function (kuji, customOptions) {
      var options = $.extend({
        isEnabled: true,
        isSelected: false,
        kuji: kuji || 'button'
      }, customOptions);

      return this.each(function (i, object) {
        $(object).data({
          options: options
        });

        /* Button
          $('<span/>').ninja().create('button' {
            size: '1.25em'
          });
        */
        if (options.kuji === 'button') {
          $(object).addClass('ninja ninjaBorder ninjaButton ninjaInline ninjaUnselectable').css({
            fontSize: options.size,
            width: options.width
          }).ninja().round();
          if ($(object).is('input')) {
            if (options.title) {
              $(object).val(options.title);
            }
          }
          else {
            if (options.title) {
              $(object).text(options.title);
            }
            if (options.icon) {
              var icon = $('<span/>').ninja().create('icon', {
                icon: options.icon,
                size: options.size
              });
              if (options.title) {
                $(object).prepend('&#160;');
              }
              $(object).prepend($(icon));
            }
          }
          if (options.isEnabled === false) {
            $(object).ninja().disable({
              isEnabled: true
            });
          }
          else {
            $(object).ninja().enable({
              isEnabled: false
            });
          }
        }

        else if (options.kuji === 'drawer') {
          var iconHandle = $('<span/>').ninja().create('icon', {
            icon: 'right',
            size: options.size
          }), handle = $('<div/>', {
            id: $(object).attr('id')
          }).ninja().create('button', {
            onDeselect: function () {
              $(iconHandle).ninja().update({
                icon: 'right'
              });
              $(object).slideUp('fast', function () {
                $(handle).ninja().round();
              });
            },
            onSelect: function () {
              $(iconHandle).ninja().update({ 
                icon: 'down'
              });
              $(handle).ninja().round({ corners: 'top' });
              $(object).slideDown('fast');
            },
            isSelected: options.isSelected,
            title: options.title,
            width: options.width
          }).prepend(iconHandle, '&#160;');
          if (!options.isSelected) {
            $(object).hide();
          }
          $(object)
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

        else if (options.kuji === 'icon') {
          $(object).addClass('ninja ninjaIcon ninjaInline');
          if (options.icon) {
            $(object).css({
              fontSize: options.size
            }).ninja().update();
          }
        }

        else if (options.kuji === 'list') {
          $(object)
            .addClass('ninja ninjaBorder ninjaEditable ninjaList ninjaShadow ninjaUnselectable')
            .hide()
            .ninja().round()
            .css({
              minWidth: options.width
            });
        }

        else if (options.kuji === 'menu') {
          options.input = $('<input/>', {
            type: 'hidden',
            value: options.value
          });
          options.list = $('<div/>').ninja().create('list', {
            input: options.input,
            names: options.names,
            onSelect: function () {
              options.onSelect.call(this);
              $(object).ninja().deselect();
            },
            values: options.values,
            width: options.width
          });
          var iconButton = $('<span/>').ninja().create('icon', {
            icon: 'down',
            size: options.size
          });
          $(object).ninja().create('button', {
            onDeselect: function () {
              $(options.list).ninja().disable();
              $(document).unbind('click');
            },
            onSelect: function () {
              $(options.list).ninja().update().enable();
              $(document).click(function () {
                $(options.list).ninja().disable();
                $(object).ninja().deselect();
              });
            },
            icon: options.icon,
            size: options.size,
            title: options.title
          }).append($(iconButton), $(options.input), $(options.list));
        }

        else if (options.kuji === 'rating') {
          $(object).addClass('ninja ninjaInline ninjaRating ninjaUnselectable');
          for (i = 1; i <= options.values.length; i++) {
            $(object).append($('<span/>')
              .ninja().create('icon', {
                icon: '&#9733;',
                size: options.size
              })
              .css({ textShadow: 'rgba(0,0,0,0.5) 0 1px 2px' }));
          }
          var hover = function (selected) {
            $('.ninjaIcon', object).each(function (i, icon) {
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
          $('.ninjaIcon', object).each(function (i, icon) {
            hover($.inArray(options.selected, options.values));
            $(icon).mouseenter(function () {
              hover(i);
            }).click(function () {
              $(object).ninja().select({ selected: options.values[i] });
            }).mouseleave(function () {
              hover($.inArray(options.selected, options.values));
            });
          });
        }

        else if (options.kuji === 'slider') {
          options = $.extend({
            value: options.values[0],
            width: 200
          }, options);
          $(object)
            .addClass('ninja ninjaInline ninjaSlider')
            .data({
              options: options
            });
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
            name: $(object).attr('id') || options.title,
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
          $(object).append($(label), $(options.input), $(track));
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
            $(object).ninja().select();
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
              $(object).ninja().select();
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
              $(object).ninja().update();
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
            $(object).ninja().update();
          }).bind('touchend', function (event) {
            event.preventDefault();
            $(object).ninja().select();
          });
        }

        else if (options.kuji === 'suggest') {
          var remove = $('<span/>')
            .ninja().create('icon', {
              icon: 'remove',
              size: options.size
            })
            .addClass('ninjaRemove');
          options.input = $('<input/>', {
            className: 'ninja ninjaBorder ninjaEditable',
            css: {
              fontSize: options.size
            },
            type: 'text'
          })
            .ninja().round()
            .focus(function () {
              options.value = options.input.val();
              if (options.value === options.title) {
                options.value = '';
                options.input.css({
                  color: '#000'
                }).val(options.value);
              }
              else if (options.value === '') {
                $(remove, object).remove();
                options.list.ninja().disable();
              }
              else {
                if ($(remove, object).length < 2) {
                  $(object).append($(remove).click(function () {
                    $(options.input).val('').focus();
                  }));
                }
                if (options.onUpdate) {
                  options.onUpdate.call(options);
                }
                else {
                  $(options.list).ninja().update();
                }
                $(options.list).ninja().enable();
              }
            })
            .blur(function () {
              options.list.ninja().disable();
              if (options.input.val() === '') {
                options.input.css({
                  color: '#999'
                }).val(options.value || options.title);
              }
            }).keydown(function (event) {
              if ($.inArray(event.keyCode, [48, 56, 57, 219, 220]) > -1) {/* metacharacters */
                return false;
              }
            })
            .keyup(function (event) {
              if (event.keyCode === 27) {/* esc */
                options.list.ninja().disable();
                return false;
              }
              else if ($.inArray(event.keyCode, [13, 38, 40]) === -1) {/* not down nor up */
                options.value = options.input.val();
                if (options.value === '') {
                  $(remove, object).remove();
                  options.list.ninja().disable();
                }
                else {
                  if ($(remove, object).length < 2) {
                    $(object).append($(remove).click(function () {
                      $(options.input).val('').focus();
                    }));
                  }
                  if (options.onUpdate) {
                    options.onUpdate.call(options);
                  }
                  else {
                    $(options.list).ninja().update();
                  }
                  if (options.value.length < 2) {
                    $(options.list).ninja().enable();
                  }
                }
              }
            });
          if (options.value) {
            options.input.val(options.value);
          }
          else {
            options.input.css({
              color: '#999'
            }).val(options.title);
          }
          options.list = $('<div/>').ninja().create('list', {
            icon: options.icon,
            input: options.input,
            names: options.names,
            onSelect: options.onSelect,
            onUpdate: options.onUpdate,
            value: options.value,
            values: options.values,
            width: '100%'
          });
          if (options.icon) {
            $(object).append($('<span/>').ninja().create('icon', {
              icon: options.icon,
              size: options.size
            }));
            $(options.input).css({ paddingLeft: '2em' });
          }
          $(object).addClass('ninja ninjaInline ninjaSuggest').append($(options.input), $(options.list));
          if (options.width) {
            $(object).width(options.width);
          }
          else if ($(object).is('span')) {
            $(object).addClass('ninjaInline');
          }
        }

        else if (options.kuji === 'window') {
          var body = $(object).is('body'), top, wrapper;
          if (body) {
            wrapper = $(object).ninja().disable();
            top = $(window).height() / 2;
          }
          else {
            wrapper = $(object).wrap($('<span/>', {
              css: {
                position: 'relative'
              }
            })).parent();
            top = wrapper.outerHeight();
          }
          options.windowBody = $('<span/>', {
            className: 'ninja'
          });
          var removeButton = $('<span/>', {
            className: 'ninja ninjaBorder ninjaEnabled ninjaGradient ninjaInline ninjaRemove',
            html: '&#215;'
          }).click(function () {
            $(object).ninja().destroy();
          });
          options.window = $('<span/>', {
            className: 'ninja ninjaBorder ninjaInline ninjaShadow ninjaWindow',
            css: {
              top: top
            }
          }).append(removeButton, options.windowBody).ninja().round();
          wrapper.append(options.window);
          var diameter = removeButton.outerHeight();
          var radius = diameter / 2;
          removeButton.css({
            right: -radius,
            top: -radius,
            width: diameter
          }).ninja().round({
            radius: radius
          });
          if (options.onCreate) {
            options.onCreate.call(object);
          }
          else {
            $(object).ninja().update();
          }
          if (body) {
            options.window.css({
              left: ($(window).width() - options.window.outerWidth()) / 2
            });
          }
          else {
            options.window.css({
              left: 0
            });
          }
          $(document).keydown(function (event) {
            if (event.keyCode === 27) {/* esc */
              $(object).ninja().destroy();
            }
          });
        }

        else {
          $(object).html('<!-- Ninja ui: Unknown type of kuji magic: ' + kuji + '-->');
        }

      });
    },

    deselect: function (customOptions) {
      return this.each(function (i, object) {
        var options = $.extend($(object).data('options'), customOptions);
        if (options.isSelected) {
          $(object).addClass('ninjaEnabled').removeClass('ninjaSelected');
          if (options.icon) {
            $('.ninjaIcon', object).ninja().update();
          }
          if (options.onDeselect) {
            options.onDeselect.call(object);
          }
          options.isSelected = false;
        }
      });
    },

    destroy: function (customOptions) {
      return this.each(function (i, object) {
        var options = $.extend($(object).data('options'), customOptions);
        if (options.kuji === 'window') {
          options.window.fadeOut('fast');
          if ($(object).is('body')) {
            $(object).ninja().enable();
          }
          else {
            options.window.unwrap();
          }
          options.window.remove();
        }
        else {
          $(object).empty();
        }
        if (options.onDestroy) {
          options.onDestroy.call();
        }
      });
    },

    disable: function (customOptions) {
      return this.each(function (i, object) {
        var options = $.extend($(object).data('options'), customOptions);
        if (options.kuji === 'list') {
          options.value = '';
          $(object).slideUp('fast');
          $(document).unbind('keydown keyup');
          if (options.onDisable) {
            options.onDisable.call(options);
          }
        }
        else if (options.kuji === 'button' && !options.message && options.isEnabled) {
          $(object)
            .animate({ opacity: 0.8 })
            .addClass('ninjaDisabled')
            .removeClass('ninjaEnabled ninjaGradient');
          $(object).unbind('click');
          if (options.onDisable) {
            options.onDisable.call(object);
          }
        }
        else if (!options.shield) {
          options.shield = $('<div/>', {
            className: 'ninja ninjaUnselectable ninjaShield',
            css: {
              maxHeight: $(window).width(),
              maxWidth: $(window).width(),
              minHeight: $(object).outerHeight(),
              minWidth: $(object).outerWidth(),
              opacity: 0.5
            }
          });
          $(object).append(options.shield);
          options.shield.fadeIn('fast', function () {
            if (options.message) {
              var icon = $('<span/>', {
                className: 'ninja ninjaIcon ninjaInline'
              }).ninja().animate({
                frames: 12
              });
              options.message = $('<span/>', {
                className: 'ninja ninjaMessage',
                css: {
                  opacity: 0.8
                },
                text: options.message
              }).ninja().round().prepend(icon);
              var left, top;
              if ($(object).outerHeight() < $(window).height()) {
                $(object).append(options.message);
                top = ($(object).outerHeight() - $(options.message).outerHeight()) / 2;
              }
              else {
                $(object).append(options.shield);
                $(document.body).append(options.message);
                top = ($(window).height() - $(options.message).outerHeight()) / 2 + $(object).scrollTop();
              }
              if ($(object).is('body')) {
                left = ($(window).width() - $(options.message).outerWidth()) / 2;
              }
              else {
                left = ($(object).outerWidth() - $(options.message).outerWidth()) / 2;
              }
              $(options.message).css({
                left: left,
                top: top
              }).fadeIn('fast');
            }
          });
        }
        if ($(object).is('input')) {
          $(object).attr('disabled', 'disabled');
        }
        options.isEnabled = false;
        $(object).data({
          options: options
        });
      });
    },

    enable: function (customOptions) {
      return this.each(function (i, object) {
        var options = $.extend($(object).data('options'), customOptions);
        if (options.kuji === 'list') {
          var slot = -1;
          var move = function (direction) {
            var choices = $('.ninjaChoice', object);
            choices.removeClass('ninjaEnabled ninjaGradient');
            if (direction === 'next') {
              if (slot === options.values.length - 1) {
                slot = 0;
              }
              else {
                slot++;
              }
            }
            else if (direction === 'previous') {
              if (slot <= 0) {
                slot = options.values.length - 1;
              }
              else {
                slot--;
              }
            }
            options.value = options.values[slot];
            options.name = options.names ? options.names[slot] : options.value;
            options.input.val(options.value);
            $(choices[slot]).addClass('ninjaEnabled ninjaGradient');
          };
          $(document).keydown(function (event) {
            if ($.inArray(event.keyCode, [27, 38, 40]) > -1) {/* esc, down or up */
              if (event.keyCode === 27) {/* esc */
                $(object).ninja().disable();
              }
              return false;
            }
          }).keyup(function (event) {
            if ($.inArray(event.keyCode, [13, 38, 40]) > -1) {/* return, down, up or esc */
              if (event.keyCode === 13) {/* return */
                $(object).ninja().select();
              }
              else if (event.keyCode === 40) {/* down arrow */
                move('next');
              }
              else if (event.keyCode === 38) {/* up arrow */
                move('previous');
              }
              return false;
            }
          });
          $(object).slideDown('fast');
        }
        else if (options.kuji === 'button' && !options.message && !options.isEnabled) {
          $(object).addClass('ninjaEnabled').removeClass('ninjaDisabled').animate({ opacity: 1 });
          if ($(object).is('input')) {
            $(object).removeAttr('disabled');
          }
          if (options.isSelected) {
            $(object).ninja().select({ isSelected: false });
          }
          if (options.icon) {
            $('.ninjaIcon', object).ninja().update('icon');
          }
          $(object).addClass('ninjaGradient').click(function (event) {
            var options = $(this).data('options');
            if (options.isSelected) {
              $(object).ninja().deselect();
            }
            else {
              $(object).ninja().select();
            }
            return false;
          });
        }
        else {
          if (options.message) {
            $(options.message, object).fadeOut('fast', function () {
              $(this).remove();
            });
            options.message = null;
          }
          if (options.shield) {
            $(options.shield, object).fadeOut('fast', function () {
              $(this).remove();
            });
            options.shield = null;
          }
        }
        options.isEnabled = true;
        if (options.onEnable) {
          options.onEnable.call(object);
        }
      });
    },

    lightness: function () {
      var color = this.css('backgroundColor');
      if (color !== undefined && color !== '' && color !== 'transparent' && color !== 'rgba(0, 0, 0, 0)') {
        var lightness = function (colorRGB) {
          return (299 * colorRGB[0] + 587 * colorRGB[1] + 114 * colorRGB[2]) / 1000;
        }, result = false;
        result = (/rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/).exec(color);
        if (result) {/* rgb(#,#,#) */
          return lightness([result[1], result[2], result[3]]);
        }
        else {
          result = (/rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/).exec(color);
          if (result) {/* rgb(%,%,%) */
            return lightness([
              parseFloat(result[1]) * 2.55,
              parseFloat(result[2]) * 2.55,
              parseFloat(result[3]) * 2.55
            ]);
          }
          else {
            result = (/#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/).exec(color);
            if (result) {/* #a0b1c2 */
              return lightness([
                parseInt(result[1], 16),
                parseInt(result[2], 16),
                parseInt(result[3], 16)
              ]);
            }
            else {
              result = (/#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/).exec(color);
              if (result) {/* #fff */
                return lightness([
                  parseInt(result[1] + result[1], 16),
                  parseInt(result[2] + result[2], 16),
                  parseInt(result[3] + result[3], 16)
                ]);
              }
              else {/* named color */
                var colors = { aqua: [0, 255, 255], azure: [240, 255, 255], beige: [245, 245, 220], black: [0, 0, 0], blue: [0, 0, 255], brown: [165, 42, 42], cyan: [0, 255, 255], darkblue: [0, 0, 139], darkcyan: [0, 139, 139], darkgrey: [169, 169, 169], darkgreen: [0, 100, 0], darkkhaki: [189, 183, 107], darkmagenta: [139, 0, 139], darkolivegreen: [85, 107, 47], darkorange: [255, 140, 0], darkorchid: [153, 50, 204], darkred: [139, 0, 0], darksalmon: [233, 150, 122], darkviolet: [148, 0, 211], fuchsia: [255, 0, 255], gold: [255, 215, 0], green: [0, 128, 0], indigo: [75, 0, 130], khaki: [240, 230, 140], lightblue: [173, 216, 230], lightcyan: [224, 255, 255], lightgreen: [144, 238, 144], lightgrey: [211, 211, 211], lightpink: [255, 182, 193], lightyellow: [255, 255, 224], lime: [0, 255, 0], magenta: [255, 0, 255], maroon: [128, 0, 0], navy: [0, 0, 128], olive: [128, 128, 0], orange: [255, 165, 0], pink: [255, 192, 203], purple: [128, 0, 128], violet: [128, 0, 128], red: [255, 0, 0], silver: [192, 192, 192], white: [255, 255, 255], yellow: [255, 255, 0], transparent: [255, 255, 255] };
                return lightness(colors[jQuery.trim(color).toLowerCase()]);
              }
            }
          }
        }
      }
      else {
        var parent = this.parent();
        if (typeof (parent) === 'array' && parent.length() > 0) {
          $(parent).ninja().lightness();
        }
        else {
          return 255;
        }
      }
    },

    round: function (customOptions) {
      return this.each(function (i, object) {
        var options = $.extend({
          corners: null,
          radius: '4px'
        }, $(object).data('options'), customOptions);
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
              $(object).css({
                'border-radius': radii[0]
              });
            }
            else {
              $(object).css({
                'border-radius': radii.join(' ')
              });
            }
          }
          else if (borderRadius && borderRadius === '-moz-border') {
            $(object).css({
              '-moz-border-radius-topleft': radii[0],
              '-moz-border-radius-topright': radii[1],
              '-moz-border-radius-bottomright': radii[2],
              '-moz-border-radius-bottomleft': radii[3]
            });
          }
          else if (borderRadius && borderRadius === '-webkit-border') {
            $(object).css({
              '-webkit-border-top-left-radius': radii[0],
              '-webkit-border-top-right-radius': radii[1],
              '-webkit-border-bottom-right-radius': radii[2],
              '-webkit-border-bottom-left-radius': radii[3]
            });
          }
        }
      });
    },

    select: function (customOptions) {
      return this.each(function (i, object) {
        var options = $.extend($(object).data('options'), customOptions);
        if (options.kuji === 'button') {
          if (!options.isSelected) {
            $(object).addClass('ninjaSelected');
            if (options.icon) {
              $('.ninjaIcon', object).ninja().update();
            }
            if (options.onSelect) {
              options.onSelect.call(object);
            }
            options.isSelected = true;
          }
        }
        else if (options.kuji === 'list') {
          options.value = $(options.input).val();
          if (options.onSelect) {
            options.onSelect.call(options);
          }
          $(options.input).blur();
          $(object).ninja().disable();
        }
        else if (options.kuji === 'slider') {
          $(options.input).val(options.value);
          $(object).ninja().update();
          if (options.onSelect) {
            options.onSelect.call(options);
          }
        }
        else if (options.kuji === 'suggest') {
          $(options.list).ninja().select();
        }
      });
    },

    update: function (customOptions) {
      return this.each(function (i, object) {
        var options = $.extend($(object).data('options'), customOptions);
        if (options.kuji === 'icon') {
          if ($.inArray(options.icon, ['add', 'arrange', 'beverage', 'bookmark', 'caution', 'check', 'down', 'download', 'edit', 'flag', 'food', 'gear', 'group', 'heart', 'home', 'in', 'left', 'lock', 'mail', 'no', 'out', 'phone', 'photo', 'print', 'profile', 'question', 'refresh', 'remove', 'right', 'search', 'star', 'target', 'unlock', 'up', 'upload', 'video']) > -1) {
            $(object).removeClass('add arrange beverage bookmark caution check down download edit flag food gear group heart home in left lock mail no out phone photo print profile question refresh remove right search star target unlock up upload video').addClass(options.icon).css({
              minHeight: '16px',
              minWidth: '16px'
            });
            if ($(object).parent().ninja().lightness() < 175) {
              $(object).addClass('ninjaIconWhite');
            }
            else {
              $(object).removeClass('ninjaIconWhite');
            }
          }
          else {
            $(object).html(options.icon).css({
              opacity: '0.8'
            });
          }
          if (options.onUpdate) {
            options.onUpdate.call(object);
          }
        }
        else if (options.kuji === 'list') {
          $(object).empty();
          if (options.input) {
            options.value = $(options.input).val();
          }
          var choices;
          if (options.names) {
            choices = options.names;
          }
          else if (options.values) {
            choices = options.values;
          }
          else {
            choices = ['No Values/Names Provided'];
          }
          $.each(choices, function (i, choice) {
            if (options.value) {
              choice = choice.toString().replace(new RegExp(options.value, 'gi'), '<strong>' + options.value + '</strong>');
            }
            $(object).append($('<div/>', {
              className: 'ninja ninjaChoice',
              html: choice
            })
              .mouseover(function () {
                $(this).addClass('ninjaEnabled ninjaGradient');
              })
              .click(function (event) {
                options.value = options.values[i];
                options.name = options.names ? options.names[i] : options.value;
                options.input.val(options.value);
                $(object).ninja().select();
              })
              .mouseleave(function () {
                $(this).removeClass('ninjaEnabled ninjaGradient');
              }));
          });
        }
        else if (options.kuji === 'slider') {
          options.slot = $.inArray(options.value, options.values);
          options.name = options.names[options.slot] || options.value;
          $(options.button).css({ left: (options.slot * options.increment) + 'px' });
          $(options.level).width(options.slot * options.increment + 'px');
          $(options.status).text(options.name);
          if (options.onUpdate) {
            options.onUpdate.call(options);
          }
        }
        else if (options.kuji === 'window') {
          $(options.windowBody).html(options.body);
        }
      });
    }

  });

  $.fn.ninja = function () {
    return ninja(this);
  };
  
}(jQuery));
