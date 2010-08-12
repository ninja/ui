$.fn.nuiMenu = function(customOptions) {
  var options = $.extend({icon:''}, customOptions);
  return this.each(function(i, select) {
    $(select).hide();
    var iconHTML = '';
    if(options.icon != '') {
      iconHTML = '<span class="nui-icon nui-icon-' + options.icon + '"></span> ';
    }
    var selectArray = $('option', select);
    $(select).after('<div class="nui nui-menu"><div class="nui-button">' + iconHTML +
      $(select).attr('title') + ' <span class="nui-icon nui-icon-down"></span></div>' +
      '<div class="nui-menu-choices"></div>' +
    '</div>');
    var menu = $(select).next('.nui-menu');
    var button = $('.nui-button', menu);
    var choices = $('.nui-menu-choices', menu);
    var closeMenu = function() {
      $(choices).slideUp();
      $(button).removeClass('nui-active');
    };
    $('option', select).each(function(i, option) {
      $(choices).append('<div class="nui-menu-choice" id="' + $(option).attr('value') + '">' + $(option).text() + '</div>');
    });
    $.each($('.nui-menu-choice', choices), function(i, choice) {
      $(choice).click(function() {
        closeMenu();
      });
    });
    $(button).click(function() {
      $(choices).slideToggle();
      $(button).toggleClass('nui-active');
      $(document).keyup(function(event) {
        if (event.keyCode == 27) { // esc key
          closeMenu();
        }
      });
      $(choices).mouseleave(function() {
        closeMenu();
      });
    });
  });
};