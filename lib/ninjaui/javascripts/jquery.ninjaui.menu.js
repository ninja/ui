$.extend($.fn.ninjaui, {
  menuCreate:function(customOptions) {
    var config = getConfig();
    var options = $.extend({
      icon:null,
      id:null,
      onChange:function(){},
      selected:null,
      title:null
    }, customOptions);
    var choices = $(global.selected).wrapAll('<span/>').parent().addClass('ninjauiMenuChoices');
    var menu;
    global.selected.each(function(i, origin) {
      var closeMenu = function() {
        $(choices).slideUp(function(){
          $(button).removeClass('ninjauiMenuButtonClicked');
        });
      };
      $(origin).children('span').each(function (i, choice){
        $(choice).addClass('ninjauiMenuChoice').click(function() {
          closeMenu(function(){
            options.onChange.call(choice);
          });
        });
      });
      var menu = $(choices).wrapAll('<span/>').parent().addClass('ninjauiMenu');
      $(menu).prepend('<span class="ninjauiMenuButton"/>');
      var button = $('.ninjauiMenuButton', menu).append('<span class="ninjauiMenuTitle"/><span class="ninjauiMenuIcon"/>');
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
    });
    return menu;
  }
});
