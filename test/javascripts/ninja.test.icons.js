/*jshint
  bitwise: true, browser: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 2, jquery: true, maxerr: 3, newcap: true, noarg: true, noempty: true, nomen: true, nonew: true, regexp: true, strict: true, undef: true, white: true
*/

(function ($) {

  'use strict';

  var $body = $('body'), $title = $('<h2/>');

  /* Icons */

  var $icons = $('<div/>');

  $.each($.ninja().icons, function (name, character) {
    var $icon = $.ninja().icon({
      css: {
        fontSize: '2em',
        margin: '0.25em'
      },
      name: name
    }).attr({
      title: name
    }).mouseenter(function () {
      $icon.css({
        color: '#900'
      });
    }).mouseleave(function () {
      $icon.css({
        color: 'black'
      });
    });
    $icons.append($icon);
  });

  $body.append($title.clone().text('Icon'), $icons);

  /* Spinner */

  var $spinner = $.ninja().spinner({
    css: {
      fontSize: '1.7em'
    },
    speed: 100
  });

  $body.append($title.clone().text('Spinner'), $spinner);

}(jQuery));
