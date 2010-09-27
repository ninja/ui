$.fn.ninjaMenuCreate = function(customOptions) {
  var options = $.extend({
    icon:null,
    onSelect:function(){},
    title:null,
    values:[]
  }, customOptions);
  return this.each(function(i, menu) {
    $(menu).addClass('ninjaMenu').append('<span class="ninjaMenuButton"/><span class="ninjaMenuChoices"/>');
    var choices = $('.ninjaMenuChoices', menu);
    $(options.values).each(function(i, value) {
      $(choices).append('<span class="ninjaMenuChoice">' + value + '</span>');
    });
    $('.ninjaMenuChoice', choices).each(function(i, choice){
      $(choice).click(function(){
        closeMenu();
        options.onSelect.call($(choice));
      });
    });
    var button = $('.ninjaMenuButton', menu).append('<span class="ninjaMenuTitle"/><span class="ninjaMenuIcon"/>');
    $('.ninjaMenuTitle', button).ninjaIconCreate({icon:options.icon, title:options.title});
    $('.ninjaMenuIcon', button).ninjaIconCreate({icon:'down'});
    var closeMenu = function() {
      $(choices).slideUp(function(){
        $(button).removeClass('ninjaMenuButtonSelected');
      });
    };
    $(button).click(function() {
      $(choices).slideToggle();
      $(button).toggleClass('ninjaMenuButtonSelected');
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
