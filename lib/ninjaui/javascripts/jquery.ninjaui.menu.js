$.extend($.fn.ninjaui, {
  menuCreate:function(customOptions) {
    var config = getConfig();
    var options = $.extend({
      icon:null,
      id:null,
      onSelect:function(){},
      title:null
    }, customOptions);
    var origin = $(global.selected);
    var choices = $(origin).wrapAll('<span/>').parent().addClass('ninjauiMenuChoices');
    var menu = $(choices).wrapAll('<span/>').parent().addClass('ninjauiMenu').prepend('<span class="ninjauiMenuButton"/>');
    var button = $('.ninjauiMenuButton', menu).append('<span class="ninjauiMenuTitle"/><span class="ninjauiMenuIcon"/>');
    var closeMenu = function() {
      $(choices).slideUp(function(){
        $(button).removeClass('ninjauiMenuButtonClicked');
      });
    };
    $(button).children('.ninjauiMenuTitle').ninjaui.iconCreate({icon:options.icon, title:options.title});
    $(button).children('.ninjauiMenuIcon').ninjaui.iconCreate({icon:'down'});
    $(button).click(function() {
      $(choices).slideToggle();
      $(button).toggleClass('ninjauiMenuButtonClicked');
      $(document).keyup(function(event) {
        if (event.keyCode == 27) { // esc key
          closeMenu();
        }
      });
      $(choices).mouseleave(function() {
        closeMenu();
      });
    });
    $(origin).each(function(i, choice) {
      $(choice).addClass('ninjauiMenuChoice').click(function() {
        closeMenu();
        options.onSelect.call($(choice));
      });
    });
    return menu;
  }
});
