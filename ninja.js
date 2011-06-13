/*copyright
  Copyright 2010 Jamie Hoover
*/

/*jshint
  bitwise: true, browser: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 2, jquery: true, maxerr: 3, newcap: true, noarg: true, noempty: true, nomen: true, nonew: true, regexp: true, strict: true, undef: true, white: true
*/

(function ($) {

  'use strict';

  var
    counter,
    ninja = $.sub();

  function uniqueNumber() {
    return counter ++;
  }

  ninja.fn.extend({

    bevel: function (direction) {
      return this.each(function () {
        var $object = $(this);
        if (direction && direction === 'in') {
          $object.css({
            backgroundImage: '-webkit-linear-gradient(top, rgba(0, 0, 0, 0.125), rgba(255, 255, 255, 0.25))'
          });
          if ($object.css('backgroundImage').indexOf('-webkit-linear-gradient') === -1) {
            $object.css({
              backgroundImage: '-moz-linear-gradient(top, rgba(0, 0, 0, 0.125), rgba(255, 255, 255, 0.25))'
            });
            if ($object.css('backgroundImage').indexOf('-moz-linear-gradient') === -1) {
              $object.css({
                backgroundImage: '-webkit-gradient(linear, left top, left bottom, from(rgba(0, 0, 0, 0.125)), to(rgba(255, 255, 255, 0.25)))'
              });
              if ($object.css('backgroundImage').indexOf('-webkit-gradient') === -1) {
                $object.css({
                  backgroundImage: "url('images/bevel.in.svg')",
                  backgroundRepeat: 'repeat-x'
                });
              }
            }
          }
        }
        else {
          $object.css({
            backgroundImage: '-webkit-linear-gradient(top, rgba(255, 255, 255, 0.25), rgba(0, 0, 0, 0.125))'
          });
          if ($object.css('backgroundImage').indexOf('-webkit-linear-gradient') === -1) {
            $object.css({
              backgroundImage: '-moz-linear-gradient(top, rgba(255, 255, 255, 0.25), rgba(0, 0, 0, 0.125))'
            });
            if ($object.css('backgroundImage').indexOf('-moz-linear-gradient') === -1) {
              $object.css({
                backgroundImage: '-webkit-gradient(linear, left top, left bottom, from(rgba(255, 255, 255, 0.25)), to(rgba(0, 0, 0, 0.125)))'
              });
              if ($object.css('backgroundImage').indexOf('-webkit-gradient') === -1) {
                $object.css({
                  backgroundImage: "url('images/bevel.out.svg')",
                  backgroundRepeat: 'repeat-x'
                });
              }
            }
          }
        }
      });
    },

    button: function (options) {
      options = $.extend({
        bevel: true,
        radius: '0.3em',
        reflect: true
      }, options);
      var $button = $.ninja('<span/>', {
        'class': 'ninja ninjaBorder ninjaButton ninjaInline'
      });
      if (options.bevel) {
        $button.bevel();
      }
      if (options.radius) {
        $button.round({
          radius: options.radius
        });
      }
      if (options.css) {
        $button.css(options.css);
      }
      if (options.html) {
        $button.html(options.html);
      }
      if (options.reflect) {
        $button.reflect();
      }
      $button.bind({
        'click.ninja': function () {
          if (!$button.is('.ninjaDisabled')) {
            if ($button.is('.ninjaSelected')) {
              $button.trigger('deselect.ninja');
            }
            else {
              $button.trigger('select.ninja');
            }
          }
        },
        'deselect.ninja': function () {
          $button.removeClass('ninjaSelected');
          if (options.bevel) {
            $button.bevel();
          }
          if (options.reflect) {
            $button.reflect();
          }
        },
        'mouseenter.ninja': function () {
          if (!$button.is('.ninjaDisabled')) {
            $button.addClass('ninjaHovered');
          }
        },
        'mouseleave.ninja': function () {
          if (!$button.is('.ninjaDisabled')) {
            $button.removeClass('ninjaHovered');
          }
        },
        'select.ninja': function () {
          $button.addClass('ninjaSelected');
          if (options.bevel) {
            $button.bevel('in');
          }
        }
      });
      if (options.select) {
        $button.trigger('select.ninja');
      }
      if (options.disable) {
        $button.disable();
      }
      return $button;
    },

    change: function (callback) {
      return this.each(function () {
        var $object = $(this);
        if ($.isFunction(callback)) {
          $object.bind('change.ninja', callback);
        }
        else {
          $object.trigger('change.ninja');
        }
      });
    },

    deselect: function (callback) {
      return this.each(function () {
        var $object = $(this);
        if (callback && $.isFunction(callback)) {
          $object.bind('deselect.ninja', callback);
        }
        else if ($object.is('.ninjaSelected') && !$object.is('.ninjaDisabled')) {
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
        }
        else {
          $object.fadeTo('fast', 0.25).addClass('ninjaDisabled').trigger('disable.ninja');
        }
      });
    },

    drawer: function (options) {
      options = $.extend({
        radius: '0.3em'
      }, options);
      var
        $tray = $('<div/>', {
          'class': 'ninja ninjaBorder ninjaDrawerTray',
          css: options.css,
          html: options.html
        }).ninja().round({
          corners: 'bottom',
          radius: options.radius
        }),
        $icon = $('<span/>', {
          'class': 'ninjaSymbol'
        }),
        $handle = $.ninja().button({
          selected: options.selected,
          html: options.title
        }).addClass('ninjaDrawerHandle').bind({
          'deselect.ninja': function () {
            $icon.addClass('ninjaSymbolMoveRight').removeClass('ninjaSymbolMoveDown');
            $tray.slideUp('fast', function () {
              $handle.ninja().round({
                radius: options.radius
              });
            });
          },
          'select.ninja': function () {
            $icon.addClass('ninjaSymbolMoveDown').removeClass('ninjaSymbolMoveRight');
            $handle.ninja().round({
              corners: 'top',
              radius: options.radius
            });
            $tray.slideDown('fast');
          }
        }).prepend($icon),
        $drawer = $('<div/>', {
          'class': 'ninja ninjaDrawer'
        }).append($handle, $tray);
      if (options.selected) {
        $icon.addClass('ninjaSymbolMoveDown');
      }
      else {
        $icon.addClass('ninjaSymbolMoveRight');
        $tray.hide();
      }
      return $drawer;
    },

    enable: function (callback) {
      return this.each(function () {
        var $object = $(this).ninja();
        if ($.isFunction(callback)) {
          $object.bind('enable.ninja', callback);
        }
        else {
          $object.fadeTo('fast', 1).removeClass('ninjaDisabled').trigger('enable.ninja');
        }
      });
    },

    error: function (message, callback) {
      return this.each(function () {
        var $object = $(this);
        if ($.isFunction(callback)) {
          $object.bind('error.ninja', callback);
        }
        else {
          $object.trigger({
            type: 'error.ninja',
            message: message
          });
        }
      });
    },

    list: function (options) {
      options = $.extend({
        gradient: true
      }, options);
      var $object = this;
      var $list = $.ninja('<div/>', {
        'class': 'ninja ninjaList'
      });
      if (options.html) {
        $list.html(options.html);
      }
      if (options.css) {
        $list.css(options.css);
      }
      $.each(options.choices, function (i, choice) {
        var $choice = $('<div/>', {
          'class': 'ninja',
          html: choice.display || choice.html || choice
        });
        if (choice.spacer) {
          $choice.addClass('ninjaListSpacer');
        }
        else {
          $choice.addClass('ninjaListChoice').bind({
            'click.ninja': function () {
              $list.trigger({
                type: 'select.ninja',
                html: choice.html || choice
              });
              /* individual select function */
              if ($.isFunction(choice.select)) {
                choice.select();
              }
            },
            'mouseenter.ninja': function () {
              $('.ninjaHovered', $list).removeClass('ninjaHovered ninjaGradient');
              $choice.addClass('ninjaHovered');
              if (options.gradient) {
                $choice.addClass('ninjaGradient');
              }
            }
          });
        }
        $list.append($choice).bind({
          'mouseleave.ninja': function () {
            $('.ninjaHovered', $list).removeClass('ninjaHovered ninjaGradient');
          }
        });
      });
      $(document).unbind('keydown.ninja keyup.ninja').bind({
        'keydown.ninja': function (event) {
          if ($.inArray(event.keyCode, [38, 40]) > -1) {/* down or up */
            return false;/* prevents page scrolling via the arrow keys when a list is active */
          }
        },
        'keyup.ninja': function (event) {
          if ($.inArray(event.keyCode, [13, 38, 40]) > -1) {/* return, down or up */
            var $button = $('.ninjaHovered', $list);
            if (event.keyCode === 13) {/* return */
              $button.click();
              $(document).unbind('keydown.ninja keyup.ninja');
            }
            else if (event.keyCode === 40) {/* down arrow */
              if ($button.length) {
                $button.mouseleave();
                if ($button.nextAll('.ninjaListChoice').length) {
                  $button.nextAll('.ninjaListChoice:first').trigger('mouseenter.ninja');
                }
                else {
                  $('.ninjaListChoice:first', $list).trigger('mouseenter.ninja');
                }
              }
              else {
                $('.ninjaListChoice:first', $list).trigger('mouseenter.ninja');
              }
            }
            else if (event.keyCode === 38) {/* up arrow */
              if ($button.length) {
                $button
                  .trigger('mouseleave.ninja')
                  .prevAll('.ninjaListChoice:first').trigger('mouseenter');
              }
              else {
                $('.ninjaListChoice:last', $list).trigger('mouseenter');
              }
            }
            return false;
          }
        }
      });
      return $list;
    },

    popup: function (options) {
      options = $.extend({
        button: false,
        radius: '0.3em',
        window: false
      }, options);
      var
        $object = this,
        $popup = $.ninja('<span/>', {
          'class': 'ninja ninjaPopup ninjaInline ninjaShadow',
          css: {
            minWidth: $object.width()
          }
        }),
        number = uniqueNumber();
      if (options.css) {
        $popup.css(options.css);
      }
      if (options.radius) {
        $popup.round({
          radius: options.radius
        });
      }
      $popup.bind({
        'detach.ninja remove.ninja': function () {
          if ($object.is('.ninjaButton.ninjaSelected')) {
            $object.deselect();
          }
          $(document).unbind('click.ninja' + number);
        },
        'update.ninja': function (event) {
          $popup.html(event.html);
          if (options.button) {
            var
              $button = $('<span/>', {
                'class': 'ninja ninjaPopupButton ninjaInline ninjaShadow ninjaSymbol ninjaSymbolClear'
              }).ninja().round({
                radius: '0.6em'
              }).click(function () {
                $popup.remove();
              });
            $popup.append($button);
          }
          $(document.body).append($popup);
          if (options.window) {
            $popup.css({
              left: ($(window).width() / 2) - ($popup.outerWidth() / 2),
              top: ($(window).height() / 2) - ($popup.outerHeight() / 2) + $(window).scrollTop()
            });
          }
          else {
            var
              offset = $object.offset(),
              $stem = $('<span/>', {
                'class': 'ninjaPopupStem ninjaSymbol ninjaSymbolTriangle'
              });
            $popup.css({
              top: offset.top + $object.outerHeight()
            });
            if (offset.left + $popup.outerWidth() > $(window).width()) {
              $popup.css({
                right: 0
              });
              $stem.css({
                right: $object.outerWidth() / 2
              });
            }
            else {
              $popup.css({
                left: offset.left
              });
              $stem.css({
                left: $object.outerWidth() / 2
              });
            }
            $popup.append($stem);
            $(document).bind('click.ninja' + number, function (event) {
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
      return $popup;
    },

    rating: function (options) {
      options = $.extend({
        starsAverage: 0,
        starsUser: 0
      }, options);
      var $rating = $('<span/>', {
        'class': 'ninja ninjaInline ninjaRating'
      }).bind({
        'mouseleave.ninja': function (event) {
          $('.ninjaStar', $rating).each(function (iStar, star) {
            var $star = $(star);
            if (iStar < options.starsAverage) {
              $star.addClass('ninjaStarAverage');
            }
            else {
              $star.removeClass('ninjaStarAverage');
            }
            if (iStar < options.starsUser) {
              $star.addClass('ninjaStarUser');
            }
            else {
              $star.removeClass('ninjaStarUser');
            }
          });
        }
      });
      $.each(options.choices, function (i, choice) {
        var iChoice = i + 1;
        var $choice = $('<span/>', {
          'class': 'ninjaStar ninjaSymbol ninjaSymbolStar'
        }).append(choice).bind({
          'mouseenter.ninja': function (event) {
            $('.ninjaStar', $rating).each(function (iStar, star) {
              var $star = $(star);
              if (iStar <= i) {
                $star.addClass('ninjaStarUser');
              }
              else {
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
      return $rating;
    },

    reflect: function () {
      return this.each(function () {
        var
          $object = $(this),
          backgroundImage = $object.css('backgroundImage');
        if (backgroundImage !== '') {
          backgroundImage = ', ' + backgroundImage;
        }
        $object.css({
          backgroundImage: '-webkit-linear-gradient(top, rgba(255, 255, 255, 0.125) 0, rgba(255, 255, 255, 0.25) 50%, rgba(255, 255, 255, 0) 50%)' + backgroundImage
        });
        if ($object.css('backgroundImage').indexOf('-webkit-linear-gradient') === -1) {
          $object.css({
            backgroundImage: '-moz-linear-gradient(top, rgba(255, 255, 255, 0.125) 0, rgba(255, 255, 255, 0.25) 50%, rgba(255, 255, 255, 0) 50%)' + backgroundImage
          });
          if ($object.css('backgroundImage').indexOf('-moz-linear-gradient') === -1) {
            $object.css({
              backgroundImage: '-webkit-gradient(linear, left top, left bottom, from(rgba(255, 255, 255, 0.125)), to(rgba(255, 255, 255, 0.25) 50%), to(rgba(255, 255, 255, 0) 50%))' + backgroundImage
            });
            if ($object.css('backgroundImage').indexOf('-webkit-gradient') === -1) {
              $object.css({
                backgroundImage: "url('images/reflect.svg')" + backgroundImage,
                backgroundRepeat: 'repeat-x'
              });
            }
          }
        }
      });
    },

    remove: function () {
      this.trigger('remove.ninja');
      $.fn.remove.apply(this);
    },

    round: function (options) {
      return this.each(function () {
        var $object = $(this);
        options = $.extend({
          corners: null,
          radius: '0.3em'
        }, options);
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
          var
            borderRadius = false,
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

    select: function (event) {
      return this.each(function () {
        var $object = $(this);
        if ($.isFunction(event)) {
          $object.bind('select.ninja', event);
        }
        else if (!$object.is('.ninjaDisabled')) {
          $object.trigger('select.ninja');
        }
      });
    },

    slider: function (options) {
      options = $.extend({
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
          'class': 'ninja ninjaSliderChoice',
          html: options.choices[options.slot].html
        }),
        $button = ninja('<span/>', {
          'class': 'ninja ninjaBorder ninjaSliderButton ninjaInline',
          css: {
            left: left
          }
        }).bevel({
          direction: 'out'
        }).round({
          radius: '1em'
        }).reflect(),
        $temp = $button.clone().css({
          display: 'none'
        }).appendTo('body'),
        buttonDiameter = $temp.outerWidth(),
        buttonRadius = buttonDiameter / 2,
        trackWidth = options.width + buttonDiameter,
        $level = ninja('<div/>', {
          'class': 'ninja ninjaBorder ninjaSliderLevel',
          css: {
            marginLeft: buttonRadius,
            marginRight: buttonRadius,
            width: left
          }
        }).bevel().round({
          radius: '0.3em'
        }).reflect(),
        $slider = $('<span/>', {
          'class': 'ninja ninjaInline ninjaSlider'
        }).bind({
          'change.ninja select.ninja': function (event) {
            var slot = function () {
              if (event.sliderX < 0) {
                return 0;
              }
              else if (event.sliderX > slots) {
                return slots;
              }
              else {
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
        $track = ninja('<div/>', {
          'class': 'ninja ninjaSliderTrack',
          css: {
            width: trackWidth
          }
        }).appendTo($slider),
        $groove = ninja('<div/>', {
          'class': 'ninja ninjaBorder ninjaSliderGroove',
          css: {
            marginLeft: buttonRadius,
            marginRight: buttonRadius,
            opacity: 0.25
          }
        }).bevel('in').round({
          radius: '0.3em'
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
          'class': 'ninja ninjaSliderTitle ninjaUnselectable',
          css: {
            marginLeft: buttonRadius
          },
          text: options.title + ': '
        }));
      }
      else {
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
      return $slider;
    },

    spinner: function (options) {
      options = $.extend({
        speed: 100
      }, options);
      var
        $foreground = $('<span/>', {
          'class': 'ninjaSpinner1'
        }),
        $background = $('<span/>', {
          'class': 'ninjaSpinner',
          css: options.css
        }).append($foreground),
        frame = 1;
      setInterval(function () {
        frame++;
        if (frame === 13) {
          frame = 1;
        }
        $foreground.attr({
          'class': 'ninjaSpinner' + frame
        });
      }, options.speed);
      return $background;
    },

    suggest: function (options) {
      options = $.extend({
        radius: '0.3em'
      }, options);
      var $suggest = $.ninja('<span/>', {
        'class': 'ninja ninjaBorder ninjaEditable ninjaInline ninjaSuggest'
      });
      if (options.css) {
        $suggest.css(options.css);
      }
      if (options.html) {
        $suggest.prepend(options.html);
      }
      if (options.radius) {
        $suggest.round({
          radius: options.radius
        });
      }
      var $input = $('<input/>', {
        'class': 'ninja',
        type: 'text'
      });
      if (options.placeholder) {
        if ($.support.opacity) {
          $input.css({
            opacity: 0.25
          });
        }
        $input.val(options.placeholder);
      }
      var $clear = $('<span/>', {
        'class': 'ninjaSuggestClear ninjaSymbol ninjaSymbolClear'
      }).bind('click.ninja', function () {
        $input.val('').focus();
        $clear.css({
          visibility: 'hidden'
        });
      });
      var $popup = $suggest.popup(), value;
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
            }
            else {
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
            if ($('.ninjaHovered', $popup).length === 0) {
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
          }
          else if (event.keyCode === 8 && value.length === 1) {/* delete last character */
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
            if ($('.ninjaHovered', $popup).length === 0) {
              $suggest.trigger({
                type: 'select.ninja',
                html: $input.val()
              });
            }
            $popup.hide();
          }
          else if ($.inArray(event.keyCode, [38, 40]) === -1) {/* not down nor up */
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
              'class': 'ninja ninjaError',
              text: 'Error: ' + event.message
            })
          }).css({
            minWidth: $suggest.outerWidth()
          });
        },
        'select.ninja': function (event) {
          if (event.html) {
            $input.val($.trim(event.html.toString().replace(new RegExp('/<\/?[^>]+>/', 'gi'), '')));
          }
          else {
            event.html = $input.val();
          }
          $input.blur();
          $popup.hide();
        },
        'update.ninja': function (event) {
          if (event.choices.length) {
            value = $input.val();
            $popup.show().update({
              html: $.ninja().list({
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
          }
          else {
            $popup.hide();
          }
        }
      }).append($input, $clear);
      return $suggest;
    },

    tabs: function (options) {
      options = $.extend({
        bevel: true,
        choice: 0,
        radius: '0.3em',
        reflect: true
      }, options);
      var $object = this;
      var $tabs = $.ninja('<span/>', {
        'class': 'ninja ninjaInline'
      });
      if (options.css) {
        $tabs.css(options.css);
      }
      $.each(options.choices, function (i, choice) {
        var $choice = ninja('<span/>', {
          'class': 'ninja ninjaBorder ninjaInline ninjaTab ninjaUnselectable',
          html: choice.html || choice
        }).bevel().reflect().bind({
          'click.ninja': function () {
            ninja('.ninjaTab', $tabs).bevel().reflect().removeClass('ninjaSelected');
            $choice.bevel('in').addClass('ninjaSelected');
            $tabs.trigger({
              type: 'select.ninja',
              html: choice.html || choice
            });
            if ($.isFunction(choice.select)) {
              choice.select();
            }
          },
          'mouseenter.ninja': function () {
            $choice.addClass('ninjaHovered');
          },
          'mouseleave.ninja': function () {
            $choice.removeClass('ninjaHovered');
          }
        });
        if (i === 0) {
          $choice.addClass('ninjaTabFirst').ninja().round({
            corners: 'left',
            radius: options.radius
          });
        }
        else if (i === options.choices.length - 1) {
          $choice.ninja().round({
            corners: 'right',
            radius: options.radius
          });
        }
        if (i === options.choice - 1) {
          $choice.bevel('in').addClass('ninjaSelected');
        }
        $tabs.append($choice);
      });
      return $tabs;
    },

    update: function (callback) {
      return this.each(function () {
        var $object = $(this);
        if ($.isFunction(callback)) {
          $object.bind('update.ninja', callback);
        }
        else if (callback) {
          if (callback.html) {
            $object.trigger({
              type: 'update.ninja',
              html: callback.html
            });
          }
          else if (callback.choices) {
            $object.trigger({
              type: 'update.ninja',
              choices: callback.choices
            });
          }
        }
        else {
          $object.trigger('update.ninja');
        }
      });
    },

    version: function () {
      return '1.0beta2';
    }

  });

  $.ninja = ninja;

  $.fn.ninja = function () {
    return ninja(this);
  };

}(jQuery));
