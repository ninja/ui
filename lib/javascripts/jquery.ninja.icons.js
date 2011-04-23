/*copyright
  Copyright 2010 Jamie Hoover
*/

/*jshint
  bitwise: true, browser: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 2, jquery: true, maxerr: 3, newcap: true, noarg: true, noempty: true, nomen: true, nonew: true, regexp: true, strict: true, undef: true, white: true
*/

(function ($) {

  'use strict';

  $.ninja.fn.extend({

    icon: function (options) {
      options = $.extend({
        name: 'alert'
      }, options);
      var $icon = $.ninja('<span/>', {
        css: options.css,
        className: 'ninjaIcon ninjaInline',
        html: $.ninja().icons[options.name]
      });
      return $icon;
    },

    icons: {
      alert: '!',
      arrowDown: 'v',
      arrowLeft: '<',
      arrowRight: '>',
      arrowUp: '^',
      calendar: 'c',
      check: '&#8730;',
      chrome: 'C',
      circle: '&#8226;',
      clear: 'x',
      clip: '©',
      diamond: '&#9674;',
      directions: 'd',
      edit: 'e',
      explorer: 'E',
      facebook: 'f',
      female: ']',
      firefox: 'F',
      flag: '&#x192;',
      gear: 'g',
      heart: '¼',
      heartPlus: '½',
      heartMinus: '¾',
      help: '?',
      home: '&pi;',
      infinity: '&#8734;',
      info: 'i',
      install: 'I',
      link: '±',
      lock: 'l',
      mac: 'M',
      mail: '@',
      male: '[',
      map: 'm',
      moveBack: '&#8249;',
      moveDown: '&#x2c7;',
      moveForward: '&#8250;',
      moveUp: '&#710;',
      minus: '-',
      ninja: 'N',
      not: 'ø',
      options: '&#8225;',
      photo: 'P',
      plus: '+',
      remove: 'X',
      safari: 'S',
      search: 'Q',
      shipping: 's',
      star: '*',
      thought: 'T',
      thumbsDown: '&#8804;',
      thumbsUp: '&#8805;',
      time: '&#xd8;',
      triangle: '&#x2206;',
      tweet: 't',
      ubuntu: 'U',
      unlock: 'u',
      user: '(',
      users: ')',
      video: 'V',
      watch: 'o',
      weather: 'w',
      windows: 'W'
    },

    spinner: function (options) {
      options = $.extend({
        speed: 100
      }, options);
      var
        frames = ['1', '2', '3', '4', '5', '6', '7', '8', '9', ':', ';', '='],
        $frame = $('<span/>', {
          css: options.css,
          className: 'ninja ninjaInline ninjaSpinnerFrame'
        }),
        $spinner = $('<span/>', {
          css: options.css,
          className: 'ninja ninjaInline ninjaSpinner',
          text: '0'
        }).append($frame),
        frame = -1;
      setInterval(function () {
        frame++;
        if (frame === frames.length) {
          frame = 0;
        }
        $frame.text(frames[frame]);
      }, options.speed);
      return $spinner;
    }

  });

}(jQuery));
