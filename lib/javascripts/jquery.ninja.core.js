/*copyright
  Copyright 2010 Jamie Hoover
*/

/*jshint
  bitwise: true, browser: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 2, jquery: true, maxerr: 3, newcap: true, noarg: true, noempty: true, nomen: true, nonew: true, regexp: true, strict: true, undef: true, white: true
*/

(function ($) {

  'use strict';

  var ninja = $.sub();

  ninja.fn.extend({

    version: function () {
      return 'VERSION';
    }

  });

  $.ninja = ninja;

  $.fn.ninja = function () {
    return ninja(this);
  };

}(jQuery));
