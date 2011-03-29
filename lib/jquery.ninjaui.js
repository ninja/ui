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

  var ninja = $.sub();

  /* Capitalize - capitalize the initial character of a word. */
  function capitalize(word) {
    return word.replace(/^\w/, function (character) {
      return character.toUpperCase();
    });
  }

  /* Unique ID - Create a unique number to append to muliple objects of the same type, such as popups. */
  var counter = 0;
  function uniqueId() {
    return counter ++;
  }

  ninja.fn.extend({

    /* Button - ninja object that can be enabled/disabled or selected/deselected by the user or a function. */
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
        'click.ninja': function () {
          if ($button.is('.ninjaSelected')) {
            $button.trigger('deselect.ninja');
          }
          else {
            $button.trigger('select.ninja');
          }
        },
        'deselect.ninja': function () {
          $button.removeClass('ninjaSelected');
        },
        'mouseenter.ninja': function () {
          $button.addClass('ninjaHovered');
        },
        'mouseleave.ninja': function () {
          $button.removeClass('ninjaHovered');
        },
        'select.ninja': function () {
          $button.addClass('ninjaSelected');
        }
      });
      if (options.select) {
        $button.trigger('select.ninja');
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
          $object.animate({
            opacity: 0.5
          }, 'fast');
          var $shield = $('<div/>', {
            className: 'ninja ninjaShield ninjaUnselectable',
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

    drawer: function (options) {
      options = $.extend({
        radius: '0.25em',
        theme: 'light'
      }, options);
      var
        $tray = $('<div/>', {
          className: 'ninja ninjaBorder ninjaDrawerTray',
          css: options.css,
          html: options.html
        }).ninja().round({
          corners: 'bottom',
          radius: options.radius
        }),
        $icon = ninja('<span/>', {
          className: 'ninja ninjaIcon ninjaInline'
        }),
        $handle = $.ninja().button({
          selected: options.selected,
          html: options.title
        }).addClass('ninjaDrawerHandle').bind({
          'deselect.ninja': function () {
            $icon.text('$');
            $tray.slideUp('fast', function () {
              $handle.ninja().round({
                radius: options.radius
              });
            });
          },
          'select.ninja': function () {
            $icon.text('%');
            $handle.ninja().round({
              corners: 'top',
              radius: options.radius
            });
            $tray.slideDown('fast');
          }
        }).prepend($icon),
        $drawer = $('<div/>', {
          className: 'ninja ninjaDrawer'
        }).append($handle, $tray);
      if (options.selected) {
        $icon.text('%');
      }
      else {
        $icon.text('$');
        $tray.hide();
      }
      return $drawer;
    },

    deselect: function (callback) {
      return this.each(function () {
        var $object = $(this);
        if (callback && $.isFunction(callback)) {
          $object.bind('deselect.ninja', callback);
        }
        else if ($object.is('.ninjaSelected')) {
          $object.trigger('deselect.ninja');
        }
      });
    },

    enable: function (callback) {
      return this.each(function () {
        var $object = $(this).ninja();
        if ($.isFunction(callback)) {
          $object.bind('enable.ninja', callback);
        }
        else {
          $('.ninjaShield', $object).remove();
          $object.animate({
            opacity: 1
          }, 'fast');
          $object.trigger('enable.ninja');
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
    
    /* Icon - object that contains a symbol font character. */
    icon: function (name) {
      var icons = {arrowBottom: '5', arrowBottomAlt: '%', arrowLeft: '6', arrowLeftAlt: '^', arrowRight: '4', arrowRightAlt: '$', arrowUp: '3', arrowUpAlt: '#', article: '>', at: '@', beaker: 'z', beakerAlt: 'Z', bolt: 'b', book: 'e', bookAlt: 'E', box: 'o', calendar: 'a', calendarAlt: 'A', chat: 'j', chatAlt: 'J', check: 'y', checkAlt: 'Y', clock: 'c', cog: 'w', cogAlt: 'W', comment: 'q', commentAlt: 'Q', cursor: ')', denied: '`', dial: '2', document: 'd', equalizer: '<', exitFullscreen: ';', eyedropper: '~', fullscreen: ':', headphones: ',', heart: 'h', home: '!', image: '?', info: 'i', key: 'k', lightBulb: '0', link: '/', locked: 'L', magnifyingGlass: 'f', mail: 'm', mailAlt: 'M', mapPin: '\\', minus: '-', minusAlt: '_', moon: ']', move: '9', moveVertical: '8', moveHorizontal: '7', moveAlt: '(', moveVerticalAlt: '*', moveHorizontalAlt: '&', mute: 'V', newWindow: '1', pencil: 'p', pencilAlt: 'P', phone: 'n', pin: '|', plus: '+', plusAlt: '=', quote: '"', quoteAlt: "'", readMore: '.', rss: 'r', spin: '[', spinAlt: '{', star: 's', sun: '}', tag: 'g', trash: 't', unlocked: 'l', user: 'u', volume: 'v', x: 'x', xAlt: 'X'};
      var $icon = ninja('<span/>', {
        className: 'ninja ninjaIcon ninjaInline',
        text: icons[name]
      });
      return $icon;
    },
    
    /* List - array of choice objects that call a common function, individual functions or a combination of both. */
    list: function (options) {
      options = $.extend({
        gradient: true,
        theme: 'light'
      }, options);
      var $object = this;
      var $list = ninja('<div/>', {
        className: 'ninja ninjaList'
      });
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
        var $choice = $('<div/>', {
          className: 'ninja ninjaChoice ninjaUnselectable',
          html: choice.display || choice.html || choice
        });
        if (!choice.spacer) {
          $choice.bind({
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
            return false;
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
                if ($button.nextAll('.ninjaChoice').length) {
                  $button.nextAll('.ninjaChoice:first').trigger('mouseenter.ninja');
                }
                else {
                  $('.ninjaChoice:first', $list).trigger('mouseenter.ninja');
                }
              }
              else {
                $('.ninjaChoice:first', $list).trigger('mouseenter.ninja');
              }
            }
            else if (event.keyCode === 38) {/* up arrow */
              if ($button.length) {
                $button
                  .trigger('mouseleave.ninja')
                  .prevAll('.ninjaChoice:first').trigger('mouseenter');
              }
              else {
                $('.ninjaChoice:last', $list).trigger('mouseenter');
              }
            }
            return false;
          }
        }
      });
      return $list;
    },
    
    /* Pop-Up - layered object, positioned under calling object or optionally centered inside the browser window. */
    popup: function (options) {
      options = $.extend({
        button: false,
        radius: '0.25em',
        theme: 'light',
        window: false
      }, options);
      var
        $object = this,
        $popup = ninja('<span/>', {
          className: 'ninja ninjaBorder ninjaPopup ninjaInline ninjaShadow'
        }),
        id = uniqueId();
      if (options.theme) {
        $popup.themeToggle(options.theme);
      }
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
          $(document).unbind('click.ninja' + id);
        },
        'update.ninja': function (event) {
          $popup.html(event.html);
          if (options.button) {
            var $button = $.ninja().icon('xAlt').addClass('ninjaPopupButton ninjaShadow').bind('click.ninja', function () {
              $popup.remove();
            }).round({
              radius: '1em'
            });
            $popup.append($button);
          }
          $(document.body).append($popup);
          if (options.window) {
            $popup.css({
              left: ($(window).width() / 2) - ($popup.outerWidth() / 2),
              top: ($(window).height() / 2) - ($popup.outerHeight() / 2) + $(document.body).scrollTop()
            });
          }
          else {
            var
              offset = $object.offset(),
              $stem = $.ninja().icon('arrowUp').addClass('ninjaPopupStem');
            if (offset.top + $popup.outerHeight() > $(window).height() + $(document.body).scrollTop()) {
              $popup.css({
                bottom: 0
              });
            }
            else {
              $popup.css({
                top: offset.top + $object.outerHeight()
              });
            }
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
      return $popup;
    },

    rating: function (options) {
      options = $.extend({
        starsAverage: 0,
        starsUser: 0
      }, options);
      var $rating = $('<span/>', {
        className: 'ninja ninjaInline ninjaRating'
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
        var $choice = $.ninja().icon('star').addClass('ninjaStar').append(choice).bind({
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

    remove: function () {
      this.trigger('remove.ninja');
      $.fn.remove.apply(this);
    },
    
    round: function (options) {
      return this.each(function () {
        var $object = $(this);
        options = $.extend({
          corners: null,
          radius: '0.25em'
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

    select: function (event) {
      return this.each(function () {
        var $object = $(this);
        if ($.isFunction(event)) {
          $object.bind('select.ninja', event);
        }
        else {
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
          className: 'ninja ninjaSliderChoice',
          html: options.choices[options.slot].html
        }),
        $button = $('<span/>', {
          className: 'ninja ninjaBorder ninjaSliderButton ninjaGradient ninjaInline ninjaShadow',
          css: {
            left: left
          }
        }).ninja().round({
          radius: '50%'
        }),
        $temp = $button.clone().css({
          display: 'none'
        }).appendTo('body'),
        buttonDiameter = $temp.outerWidth(),
        buttonRadius = buttonDiameter / 2,
        trackWidth = options.width + buttonDiameter,
        $level = $('<div/>', {
          className: 'ninja ninjaBorder ninjaGradient ninjaSliderLevel',
          css: {
            marginLeft: buttonRadius,
            marginRight: buttonRadius,
            width: left
          }
        }).ninja().round({
          radius: '1em'
        }),
        $slider = $('<span/>', {
          className: 'ninja ninjaInline ninjaSlider'
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
        $track = $('<div/>', {
          className: 'ninja ninjaSliderTrack',
          css: {
            width: trackWidth
          }
        }).appendTo($slider),
        $groove = $('<div/>', {
          className: 'ninja ninjaBorder ninjaGradient ninjaSliderGroove',
          css: {
            marginLeft: buttonRadius,
            marginRight: buttonRadius,
            opacity: 0.25
          }
        }).ninja().round({
          radius: '0.25em'
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
          className: 'ninja ninjaSliderTitle ninjaUnselectable',
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


    /*
      Animated image to show during a synchronous event.
    */
    spinner: function (options) {
      options = $.extend({
        speed: 100
      }, options);
      var
        $spinner = $('<span/>', {
          className: 'ninja ninjaInline ninjaSpinner'
        }),
        frames = 12,
        frame = 0,
        increment = 16;
      function advance() {
        $spinner.css({
          backgroundPosition: (frame * -(increment)) + 'px center'
        });
        frame++;
        if (frame === frames) {
          frame = 0;
        }
      }
      setInterval(function () {
        advance();
      }, options.speed);
      return $spinner;
    },

    /* Suggest - ninja object for suggesting completions to what a user types. */
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
        }).val(options.placeholder);
      }
      var $clear = $.ninja().icon('xAlt').addClass('ninjaSuggestClear').bind('click.ninja', function () {
        $input.val('').focus();
        $clear.hide();
      });
      var $popup = $suggest.popup(), value;
      $input.bind({
        'focus.ninja': function () {
          if (!$input.is('.ninjaFocused')) {
            $input.addClass('ninjaFocused');
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
                $clear.show();
              }
            }
            $input.css({
              opacity: 1
            });
          }
        },
        'blur.ninja': function (event) {
          if ($input.is('.ninjaFocused')) {
            $input.removeClass('ninjaFocused');
            if (options.placeholder && $input.val() === '') {
              $input.css({
                opacity: 0.25
              }).val(options.placeholder);
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
            $clear.hide();
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
            if (event.keyCode !== 8 && valueNew.length === 1) {
              $suggest.append($clear);
              $clear.show();
            }
            if (valueNew.length !== 0 && value !== $input.val()) {
              $suggest.trigger({
                type: 'change.ninja',
                value: $input.val()
              });
            }
          }
        }
      });
      $suggest.bind({
        'error.ninja': function (event) {
          $popup.update({
            html: $('<div/>', {
              className: 'ninja ninjaError',
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
      }).append($input);
      return $suggest;
    },
    
    themeToggle: function (name) {
      return this.each(function (object) {
        var $object = $(this);
        $object.toggleClass('ninjaTheme' + capitalize(name));
      });
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
    }
    
  });
  
  $.ninja = function () {
    return ninja();
  };
  
  $.fn.ninja = function () {
    return ninja(this);
  };
  
}(jQuery));