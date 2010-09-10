$.fn.ninjaMenuCreate = function(customOptions) {
  var options = $.extend({
    icon:null,
    id:null,
    onSelect:function(){},
    title:null
  }, customOptions);
  var choices = this.wrapAll('<span/>').parent().addClass('ninjaMenuChoices');
  var menu = $(choices).wrapAll('<span/>').parent().addClass('ninjaMenu').prepend('<span class="ninjaMenuButton"/>');
  var button = $('.ninjaMenuButton', menu).append('<span class="ninjaMenuTitle"/><span class="ninjaMenuIcon"/>');
  var closeMenu = function() {
    $(choices).slideUp(function(){
      $(button).removeClass('ninjaMenuButtonClicked');
    });
  };
  $(button).children('.ninjaMenuTitle').ninjaIconCreate({icon:options.icon, title:options.title});
  $(button).children('.ninjaMenuIcon').ninjaIconCreate({icon:'down'});
  $(button).click(function() {
    $(choices).slideToggle();
    $(button).toggleClass('ninjaMenuButtonClicked');
    $(document).keyup(function(event) {
      if (event.keyCode == 27) { // esc key
        closeMenu();
      }
    });
    $(choices).mouseleave(function() {
      closeMenu();
    });
  });
  return this.each(function(i, choice) {
    $(choice).addClass('ninjaMenuChoice').click(function() {
      closeMenu();
      options.onSelect.call($(choice));
    });
  });
};
