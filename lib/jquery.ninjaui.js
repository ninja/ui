/*
  Ninja ui 1.0.0alpha
  http://ninjaui.com/
  Copyright 2010-2011, Jamie Hoover
  Dependency: jQuery 1.4.4 or higher
*/
/*global jQuery: false*/
/*jslint bitwise: true, browser: true, indent: 2, newcap: true, nomen: true, regexp: true, undef: true, white: true*/
(function ($) {

  var ninja = jQuery.sub();
  
  ninja.fn.extend({

    animate: function (customOptions) {
      return this.each(function (i, object) {
        var options = $.extend({
          frames: 0,
          frameCurrent: 1,
          height: 16,
          speed: 100
        }, $(object).data().options, customOptions);
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
      var options = $.extend(true, {
        colors: {
          disabled: {
            backgroundColor: '#ddd',
            borderColor: '#aaa',
            color: '#999'
          },
          editable: {
            backgroundColor: '#fff',
            borderColor: '#bbb',
            borderBottomColor: '#ddd',
            borderTopColor: '#888',
            color: '#aaa'
          },
          enabled: {
            backgroundColor: '#eee',
            borderColor: '#bbb',
            color: '#333'
          },
          selected: {
            backgroundColor: '#aaa',
            borderColor: '#777',
            color: '#fff'
          },
          selectedGroup: {
            backgroundColor: '#333',
            borderColor: '#000',
            color: '#fff'
          },
          submit: {
            backgroundColor: '#333',
            borderColor: '#000',
            color: '#fff'
          }
        },
        isEnabled: true,
        isSelected: false,
        kuji: kuji || 'button'
      }, customOptions);

      return this.each(function (i, object) {
        $(object)
          .data({ options: options })
          .addClass('ninja')
        ;

        // $('span').ninja().create('button');
        if (options.kuji === 'button') {
          $(object)
            .addClass('border button inline unselectable')
            .css({
              fontSize: options.size,
              width: options.width
            })
            .ninja().round()
          ; 
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
          if (options.isEnabled) {
            $(object).ninja().enable({ isEnabled: false });
          }
          else {
            $(object).ninja().disable();
          }
        }

        // $('span').ninja().create('drawer');
        else if (options.kuji === 'drawer') {
          var iconHandle = $('<span/>').ninja().create('icon', {
            icon: 'right',
            size: options.size
          }),
          handle = $('<div/>', { id: $(object).attr('id') })
            .ninja().create('button', {
              onDeselect: function () {
                $('.ninja.icon', this).ninja().update({ icon: 'right' });
                $(object).slideUp(function () {
                  $(handle).ninja().round();                
                });
              },
              onSelect: function () {
                $('.ninja.icon', this).ninja().update({ icon: 'down' });
                $(this).ninja().round({ corners: 'top' });
                $(object).slideDown();
              },
              isSelected: options.isSelected,
              title: options.title,
              width: options.width
            })
            .prepend($(iconHandle), '&#160;')
          ;
          if (options.isSelected) {
            $('.ninja.icon', handle).ninja().update({ icon: 'down' });
          }
          else {
            $(object).hide();
          }
          $(object)
            .removeAttr('id')
            .addClass('border drawer font')
            .css({
              backgroundColor: options.colors.editable.backgroundColor,
              borderColor: options.colors.editable.borderColor,
              borderBottomColor: options.colors.editable.borderBottomColor,
              borderTopColor: options.colors.editable.borderTopColor,
              width: options.width
            })
            .ninja().round({ corners: 'bottom' })
            .before($(handle))
          ;
        }

        // $('span').ninja().create('icon');
        else if (options.kuji === 'icon') {
          if (options.icon) {
            $(object)
              .css({ fontSize: options.size })
              .ninja().update()
            ;
          }
        }

        // $('span').ninja().create('list');
        else if (options.kuji === 'list') {
          options.isEnabled = false;
          $(object)
            .addClass('ninja border list shadow unselectable')
            .hide()
            .ninja().round()
            .css({
              backgroundColor: options.colors.editable.backgroundColor,
              borderColor: options.colors.enabled.borderColor,
              color: options.colors.enabled.color,
              width: options.width || '100%'
            })
          ;
        }

        // $('span').ninja().create('menu');
        else if (options.kuji === 'menu') {
          options.input = $('<input/>', {
            type: 'hidden',
            value: options.value
          });
          options.list = $('<div/>').ninja().create('list', {
            colors: options.colors,
            icon: options.icon,
            input: options.input,
            onSelect: function () {
              options.onSelect.call(this);
              $(object).ninja().deselect();
            },
            value: options.value,
            values: options.values
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
        
        // $('span').ninja().create('panel');
        else if (options.kuji === 'panel') {
          $(object)
            .addClass('ninja border inline panel')
            .css({
              backgroundColor: options.colors.editable.backgroundColor,
              borderColor: options.colors.editable.borderColor,
              borderBottomColor: options.colors.editable.borderBottomColor,
              borderTopColor: options.colors.editable.borderTopColor
            })
            .ninja().round();
          if (options.icon || options.title) {
            var bar = $('<div/>', {
              className: 'ninja bar button gradient unselectable'
            })
              .css(options.colors.enabled)
              .css({ fontSize: options.size })
              .ninja().round({ corners: 'top', radius: '0.4em' })
            ;
            $(object).prepend($(bar));
            if (options.title) {
              $(bar).text(options.title);
            }
            if (options.icon) {
              if (options.title) {
                $(bar).prepend('&#160;');
              }
              $(bar).prepend($('<span/>').ninja().create('icon', {
                icon: options.icon,
                size: options.size
              }));
            }
          }
        }

        // $('span').ninja().create('rating');
        else if (options.kuji === 'rating') {
          $(object).addClass('ninja inline rating unselectable');
          for (i = 1; i <= options.values.length; i++) {
            $(object).append($('<span/>')
              .ninja().create('icon', {
                icon: '&#9733;',
                size: options.size
              })
              .css({ textShadow: 'rgba(0,0,0,0.5) 0 1px 2px' }))
            ;
          }
          var hover = function (selected) {
            $('.ninja.icon', object).each(function (i, icon) {
              if (selected + 1 > i) {
                $(icon).css({ color: options.colors.selected.backgroundColor, opacity: '1' });
              }
              else if ($.inArray(options.selectedGroup, options.values) + 1 > i) {
                $(icon).css({ color: options.colors.selectedGroup.backgroundColor, opacity: '1' });
              }
              else {
                $(icon).ninja().update().css({ opacity: '0.25' });
              }
            });
          };
          $('.ninja.icon', object).each(function (i, icon) {
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

        // $('span').ninja().create('slider');
        else if (options.kuji === 'slider') {
          options = $.extend({
            value: options.values[0],
            width: '200px'
          }, options);
          $(object)
            .addClass('ninja border inline slider unselectable')
            .css({
              backgroundColor: options.colors.editable.backgroundColor,
              borderColor: options.colors.editable.borderColor,
              borderBottomColor: options.colors.editable.borderBottomColor,
              borderTopColor: options.colors.editable.borderTopColor
            })
            .ninja().round()
            .data({ options: options });
          if (options.title) {
            $(object).append($('<div/>', {
              className: 'ninja title',
              text: options.title
            }));
          }
          if (navigator.userAgent.toLowerCase().match(/(iphone|ipod|ipad)/)) {
            var select = $('<select/>', {
              name: $(object).attr('id') || options.title
            });
            $(object).append($(select));
            $.each(options.values, function (i, value) {
              $(select).append('<option/>', {
                text: options.names[i] || value,
                value: value
              });
            });
            $(select).val(options.selected).width(options.width + 'px').change(function () {
              options.onSelect.call($(':selected', select));
            });
          }
          else {
            var slots = options.values.length;
            options.increment = Math.round(options.width / slots);
            var track = $('<div/>', {
              className: 'ninja track'
            });
            options.slot = $.inArray(options.value, options.values);
            options.button = $('<span/>', {
              className: 'ninja border enabled button gradient inline unselectable'
            }).ninja().round({ radius: '0.8em' }).css(options.colors.enabled);
            options.level = $('<div/>', {
              className: 'ninja gradient level'
            }).ninja().round().css(options.colors.selected).width(options.slot * options.increment + 'px');
            options.name = options.names[options.slot] || options.value;
            options.status = $('<div/>', {
              className: 'ninja status',
              text: options.name
            });
            options.input = $('<input/>', {
              name: $(object).attr('id') || options.title,
              type: 'hidden'
            });
            $(object).append($(options.input), $(track), $(options.status));
            $(track).append($(options.button)).css({ height: $(options.button).outerHeight() });
            var buttonRadius = Math.round($(options.button).outerHeight() / 2);
            var trackWidth = options.increment * (slots - 1) + (buttonRadius * 2);
            var groove = $('<div/>', {
              className: 'ninja border gradient selected groove'
            }).ninja().round().css(options.colors.enabled).click(function (event) {
              var slot = function () {
                var max = slots - 1;
                var x = Math.round((event.pageX - (buttonRadius * 2)) / options.increment);
                if (x < 0) {
                  return 0;
                }
                else if (x > max) {
                  return max;
                }
                else {
                  return x;
                }
              };
              options.value = options.values[slot()];
              $(object).ninja().select();
            });
            $(track).width(trackWidth + 'px').prepend($(groove));
            $(options.status).width(trackWidth + 'px');
            $(options.button).css({ left: (options.slot * options.increment) + 'px', padding: 0 });
            $(groove).append($(options.level)).css({
              marginLeft: buttonRadius,
              marginRight: buttonRadius,
              top: buttonRadius - ($(groove).outerHeight() / 2)
            });
            var drag = false;
            $(options.button).mousedown(function (event) {
              var offsetX = event.pageX - $(options.button).offset().left;
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
                  var max = slots - 1;
                  var x = Math.round((event.pageX - offsetX - (buttonRadius * 2)) / options.increment);
                  if (x < 0) {
                    return 0;
                  }
                  else if (x > max) {
                    return max;
                  }
                  else {
                    return x;
                  }
                };
                options.value = options.values[slot()];
                $(object).ninja().update();
              });
            });
          }
        }
        
        // $('span').ninja().create('suggest');
        else if (options.kuji === 'suggest') {
          var remove = $('<span/>').ninja()
            .create('icon', {
              icon: 'remove',
              size: options.size
            })
            .addClass('remove')
          ;
          options.input = $('<input/>', {
            css: {
              backgroundColor: options.colors.editable.backgroundColor,
              borderColor: options.colors.editable.borderColor,
              borderBottomColor: options.colors.editable.borderBottomColor,
              borderTopColor: options.colors.editable.borderTopColor,
              color: options.colors.editable.color,
              fontSize: options.size,
              width: '100%'
            },
            className: 'ninja border query',
            type: 'text',
            value: options.value || options.title
          })
            .ninja().round()
            .focus(function () {
              options.value = $(this).val();
              if (options.value === options.title) {
                options.value = '';
                $(this)
                  .val(options.value)
                  .css({ color: options.colors.enabled.color })
                ;
              }
              else if (options.value === '') {
                $(remove, object).remove();
                $(options.list).ninja().disable();
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
              $(options.list).ninja().disable();
              if ($(this).val() === '') {
                $(this)
                  .css(options.colors.editable)
                  .val(options.value || options.title)
                ;
              }
            }).keydown(function (event) {
              if ($.inArray(event.keyCode, [48, 56, 57, 219, 220]) > -1/* metacharacters */) {
                event.preventDefault();
              }
              if (event.keyCode === 13/* return */) {
                event.preventDefault();
                return false;
              }
            })
            .keyup(function (event) {
              if (event.keyCode === 27/* esc */) {
                $(options.list).ninja().disable();
              }
              else if ($.inArray(event.keyCode, [13, 38, 40]) === -1/* not down, return nor up */) {
                $(this).focus();
              }
            })
          ;
          options.list = $('<div/>').ninja().create('list', {
            colors: options.colors,
            icon: options.icon,
            input: options.input,
            onSelect: options.onSelect,
            onUpdate: options.onUpdate,
            value: options.value,
            values: options.values
          });
          if (options.icon) {
            $(object).append($('<span/>').ninja().create('icon', {
              icon: options.icon,
              size: options.size
            }).addClass('suggest'));
            $(options.input).css({ paddingLeft: '2em' });
          }
          $(object)
            .addClass('ninja inline suggest')
            .width(options.width)
            .append($(options.input), $(options.list))
          ;
        }

        // $('span').ninja().create('rainbow');
        else {
          $(object).text('<!-- Ninja ui: Unknown type of kuji magic: ' + kuji + '-->');
        }

        if (options.onCreate) {
          options.onCreate.call(object);
        }

      });
    },

    deselect: function (customOptions) {
      return this.each(function (i, object) {
        var options = $.extend($(object).data().options, customOptions);
        if (options.isSelected) {
          $(object).removeClass('selected'); 
          if ($(object).attr('type') === 'submit') {
            $(object).css(options.colors.submit);
          }
          else {
            $(object).css(options.colors.enabled);
          }
          if (options.icon) {
            $('.ninja.icon', object).ninja().update();
          }
          if (options.onDeselect) {
            options.onDeselect.call(object);
          }
          options.isSelected = false;
        }
      });
    },

    disable: function (customOptions) {
      return this.each(function (i, object) {
        var options = $.extend($(object).data().options, customOptions);
        if (options.isEnabled) {
          if (options.kuji === 'list') {
            options.value = '';
            $(object).slideUp();
            $(document).unbind('keydown').unbind('keyup');
            if (options.onDisable) {
              options.onDisable.call(options);
            }
          }
          else {
            $(object)
              .animate({ opacity: 0.8 })
              .removeClass('enabled')
              .removeClass('gradient')
              .addClass('disabled')
              .css(options.colors.disabled)
            ;
            $(object).unbind('click');
            if (options.onDisable) {
              options.onDisable.call(object);
            }
          }
        }
        else if (options.kuji != 'list') {
          $(object)
            .css({ opacity: 0.8 })
            .addClass('disabled')
            .css(options.colors.disabled)
          ;
        }
        if ($(object).is('input')) {
          $(object).attr('disabled', 'disabled');
        }
        options.isEnabled = false;
      });
    },

    enable: function (customOptions) {
      return this.each(function (i, object) {
        var options = $.extend($(object).data().options, customOptions);
        if (!options.isEnabled) {
          if (options.kuji === 'list') {
            var move = function (direction) {
              var
              choices = $('.ninja.choice', object).removeClass('gradient').css({
                backgroundColor: options.colors.editable.backgroundColor,
                borderColor: options.colors.enabled.borderColor,
                color: options.colors.enabled.color
              }),
              slot = $.inArray(options.value, options.values)
              ;
              if (direction === 'next') {
                if (slot === -1 || slot === options.values.length - 1) {
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
              $(choices[slot]).addClass('gradient').css(options.colors.selected);
              $(options.input).val(options.value);
            };
            $(document).keydown(function (event) {
              if ($.inArray(event.keyCode, [27, 38, 40]) > -1/* esc, down or up */) {
                event.preventDefault();
                if (event.keyCode === 27/* esc */) {
                  $(object).ninja().disable();
                }
                return false;
              }
            }).keyup(function (event) {
              if ($.inArray(event.keyCode, [13, 38, 40]) > -1/* return, down, up or esc */) {
                event.preventDefault();
                if (event.keyCode === 13/* return */) {
                  $(object).ninja().select();
                }
                else if (event.keyCode === 40/* down arrow */) {
                  move('next');
                }
                else if (event.keyCode === 38/* up arrow */) {
                  move('previous');
                }
                return false;
              }
            });
            $(object).slideDown();
          }
          else {
            $(object)
              .removeClass('disabled')
              .addClass('enabled')
              .animate({ opacity: 1 })
            ;
            if ($(object).is('input')) {
              $(object).removeAttr('disabled');
            }
            if (options.isSelected) {
              $(object).ninja().select({ isSelected: false });
            }
            else if ($(object).is('input') && $(object).attr('type') === 'submit') {
              $(object).css(options.colors.submit);
            }
            else {
              $(object).css(options.colors.enabled);
            }
            if (options.icon) {
              $('.ninja.icon', object).ninja().update('icon');
            }
            $(object).addClass('gradient').click(function (event) {
              event.preventDefault();
              if (options.isSelected) {
                $(object).ninja().deselect();
              }
              else {
                $(object).ninja().select();
              }
              return false;
            });
          }
          options.isEnabled = true;
        }
        if (options.onEnable) {
          options.onEnable.call(object);
        }
      });
    },

    lightness: function () {
      var color = this.css('backgroundColor');
      if (color !== undefined && color !== '' && color != 'transparent' && color != 'rgba(0, 0, 0, 0)') {
        var lightness = function (colorRGB) {
          return (299 * colorRGB[0] + 587 * colorRGB[1] + 114 * colorRGB[2]) / 1000;
        }, result = false;
        result = (/rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/).exec(color);
        if (result/* rgb(#,#,#) */) {
          return lightness([result[1], result[2], result[3]]);
        }
        else {
          result = (/rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/).exec(color);
          if (result/* rgb(%,%,%) */) {
            return lightness([
              parseFloat(result[1]) * 2.55,
              parseFloat(result[2]) * 2.55,
              parseFloat(result[3]) * 2.55
            ]);
          }
          else {
            result = (/#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/).exec(color);
            if (result/* #a0b1c2 */) {
              return lightness([
                parseInt(result[1], 16),
                parseInt(result[2], 16),
                parseInt(result[3], 16)
              ]);
            }
            else {
              result = (/#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/).exec(color);
              if (result/* #fff */) {
                return lightness([
                  parseInt(result[1] + result[1], 16),
                  parseInt(result[2] + result[2], 16),
                  parseInt(result[3] + result[3], 16)
                ]);
              }
              else/* named color */ {
                var colors = { aqua: [0, 255, 255], azure: [240, 255, 255], beige: [245, 245, 220], black: [0, 0, 0], blue: [0, 0, 255], brown: [165, 42, 42], cyan: [0, 255, 255], darkblue: [0, 0, 139], darkcyan: [0, 139, 139], darkgrey: [169, 169, 169], darkgreen: [0, 100, 0], darkkhaki: [189, 183, 107], darkmagenta: [139, 0, 139], darkolivegreen: [85, 107, 47], darkorange: [255, 140, 0], darkorchid: [153, 50, 204], darkred: [139, 0, 0], darksalmon: [233, 150, 122], darkviolet: [148, 0, 211], fuchsia: [255, 0, 255], gold: [255, 215, 0], green: [0, 128, 0], indigo: [75, 0, 130], khaki: [240, 230, 140], lightblue: [173, 216, 230], lightcyan: [224, 255, 255], lightgreen: [144, 238, 144], lightgrey: [211, 211, 211], lightpink: [255, 182, 193], lightyellow: [255, 255, 224], lime: [0, 255, 0], magenta: [255, 0, 255], maroon: [128, 0, 0], navy: [0, 0, 128], olive: [128, 128, 0], orange: [255, 165, 0], pink: [255, 192, 203], purple: [128, 0, 128], violet: [128, 0, 128], red: [255, 0, 0], silver: [192, 192, 192], white: [255, 255, 255], yellow: [255, 255, 0], transparent: [255, 255, 255] };
                return lightness(colors[jQuery.trim(color).toLowerCase()]);
              }
            }
          }
        }
      }
      else {
        var parent = this.parent();
        if (typeof(parent) === 'array' && parent.length() > 0) {
          $(parent).ninja().lightness();
        }
        else {
          return 255;
        }
      }
    },
    
    resume: function () {
      return this.each(function (i, object) {
        var options = $(object).data().options;
        $(options.message, object).fadeOut(function () {
          $(this).remove();
          $(options.shield, object).fadeOut(function () {
            $(this).remove();
          });
        });
      });
    },
    
    round: function (customOptions) {
      return this.each(function (i, object) {
        var options = $.extend({
          corners: null,
          radius: '4px'
        }, $(object).data().options, customOptions);
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
          if (document.body.style.borderRadius !== undefined) {
            if (radii[0] === radii[1] && radii[0] === radii[2] && radii[0] === radii[3]) {
              $(object).css({
                'border-radius': radii[0]
              });      
            }
            else {
              $(object).css({
                'border-radius': radii[0] + ' ' + radii[1] + ' ' + radii[2] + ' ' + radii[3]
              });
            }
          }
          else if (document.body.style.WebkitBorderRadius !== undefined) {
            $(object).css({
              '-webkit-border-top-left-radius': radii[0],
              '-webkit-border-top-right-radius': radii[1],
              '-webkit-border-bottom-right-radius': radii[2],
              '-webkit-border-bottom-left-radius': radii[3]
            });
          }
          else if (document.body.style.MozBorderRadius !== undefined) {
            $(object).css({
              '-moz-border-radius-topleft': radii[0],
              '-moz-border-radius-topright': radii[1],
              '-moz-border-radius-bottomright': radii[2],
              '-moz-border-radius-bottomleft': radii[3]
            });
          }
          else if (document.body.style.KhtmlBorderRadius !== undefined) {
            $(object).css({
              '-khtml-border-top-left-radius': radii[0],
              '-khtml-border-top-right-radius': radii[1],
              '-khtml-border-bottom-right-radius': radii[2],
              '-khtml-border-bottom-left-radius': radii[3]
            });
          }
        }
      });
    },

    select: function (customOptions) {
      return this.each(function (i, object) {
        var options = $.extend($(object).data().options, customOptions);
        if (options.kuji === 'button') {
          if (!options.isSelected) {
            $(object).addClass('selected').css(options.colors.selected);
            if (options.icon) {
              $('.ninja.icon', object).ninja().update();
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
        var options = $.extend($(object).data().options, customOptions);
        if (options.kuji === 'icon') {
          $(object).attr('class', 'ninja icon inline');
          if ($.inArray(options.icon, ['add', 'arrange', 'beverage', 'bookmark', 'caution', 'check', 'down', 'download', 'edit', 'flag', 'food', 'gear', 'group', 'heart', 'home', 'in', 'left', 'lock', 'mail', 'no', 'out', 'phone', 'photo', 'print', 'profile', 'question', 'refresh', 'remove', 'right', 'search', 'star', 'target', 'unlock', 'up', 'upload', 'video']) > -1) {
            $(object).addClass(options.icon);
            if ($(object).parent().ninja().lightness() < 175) {
              $(object).addClass('white');
            }
            else {
              $(object).removeClass('white');
            }
          }
          else {
            $(object).html(options.icon);
            if ($(object).parent().ninja().lightness() < 175) {
              $(object).css({ color: '#fff', opacity: '0.8' });
            }
            else {
              $(object).css({ color: '#666', opacity: '0.8' });
            }
          }
          if (options.onUpdate) {
            options.onUpdate.call(object);
          }
        }
        else if (options.kuji === 'list') {
          options.value = $(options.input).val();
          if (options.values[0]) {
            $(object).empty();
            var paddingLeft;
            if (options.icon) {
              paddingLeft = '2em';
            }
            else {
              paddingLeft = '0.5em';
            }
            $.each(options.values, function (i, value) {
              var choice = $('<div/>', {
                className: 'ninja choice',
                css: { paddingLeft: paddingLeft }
              })
                .mouseover(function () {
                  $(this).addClass('gradient').css(options.colors.selected);
                })
                .click(function (event) {
                  event.preventDefault();
                  options.value = value;
                  $(options.input).val(value);
                  $(object).ninja().select();
                  return false;
                })
                .mouseleave(function () {
                  $(this).removeClass('gradient').css({
                    backgroundColor: options.colors.editable.backgroundColor,
                    borderColor: options.colors.enabled.borderColor,
                    color: options.colors.enabled.color
                  });
                })
              ;
              if (options.names) {
                $(choice).html(options.names[i]);
              }
              else if (options.value !== value) {
                $(choice).html(value.replace(new RegExp(options.value, 'gi'), '<span>' + options.value + '</span>'));
              }
              else {
                $(choice).text(value);
              }
              $(object).append($(choice));
            });
          }
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
      });
    },
    
    wait: function (kuji, customOptions) {
      return this.each(function (i, object) {
        var options = $.extend({
          shield: $('<div/>', {
            className: 'ninja wait',
            css: {
              height: $(object).outerHeight(),
              opacity: 0.5
            }
          }),
          text: 'Loading...'
        }, $(object).data().options, customOptions);
        options.message = $('<span/>', {
          className: 'ninja message',
          css: {
            opacity: 0.8
          }
        }).ninja().round().text(options.text).prepend($('<span/>', {
          className: 'ninja icon inline'
        }).ninja().animate({
          frames: 12
        }));
        $(object).append(options.shield, options.message);
        $(options.shield).fadeIn('fast', function () {
          $(options.message).css({
            left: ($(object).outerWidth() - $(options.message).outerWidth()) / 2,
            top: ($(object).outerHeight() - $(options.message).outerHeight()) / 2
          }).fadeIn('slow');
        });
        $(object).data().options = options;
      });
    }

  });
  
  jQuery.fn.ninja = function () {
    return ninja(this);
  };

})((function (jQuery) {
  // Make jQuery 1.5 sub function backwards compatible
  if (!jQuery.sub) {
    jQuery.sub = function () {
      function jQuerySubclass(selector, context) {
        return new jQuerySubclass.fn.init(selector, context);
      }
      jQuery.extend(true, jQuerySubclass, this);
      jQuerySubclass.superclass = this;
      jQuerySubclass.fn = jQuerySubclass.prototype = this();
      jQuerySubclass.fn.constructor = jQuerySubclass;
      jQuerySubclass.subclass = this.subclass;
      var rootjQuerySubclass;
      jQuerySubclass.fn.init = function init(selector, context) {
        if (context && context instanceof jQuery && !(context instanceof jQuerySubclass)) {
          context = jQuerySubclass(context);
        }
        return jQuery.fn.init.call(this, selector, context, rootjQuerySubclass);
      };
      jQuerySubclass.fn.init.prototype = jQuerySubclass.fn;
      rootjQuerySubclass = jQuerySubclass(document);
      return jQuerySubclass;
    };
  }
  return jQuery;
})(jQuery));
