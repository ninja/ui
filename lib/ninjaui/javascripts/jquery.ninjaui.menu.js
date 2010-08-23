$.extend($.fn.ninjaui, {
  menuCreate:function(customOptions) {
    var config = getConfig();
    var options = $.extend({
      icon:'',
      onChange:function(){}
    }, customOptions);
    return global.selected.each(function(i, select) {
      $(select).hide();
      var titleHTML = '';
      var titleText = $(select).attr('title');
      if(options.icon != '') {
        titleHTML = '<span class="nui-icon nui-icon-' + options.icon + '">' + titleText + '</span> ';
      }
      else {
        titleHTML = titleText;
      }
      $(select).after('<div class="nui nui-menu"><div class="nui-button">' + titleHTML + ' <span class="nui-icon nui-icon-down"></span></div>' +
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
        var item = $('<div class="nui-menu-choice"></div>');
        item.text($(option).text());
        item.click(function() {
          closeMenu();
          options.onChange.call(option);
        });
        $(choices).append(item);
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
  }
});
