$.fn.ninjaMenuCreate = function(customOptions) {
  var options = $.extend({
    colors:$.ninjaColors,
    icon:null,
    onSelect:function(){},
    radius:$.ninjaRadius.half,
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
      $(choice).css(options.colors.foreground).mouseover(function(){
        $(choice).css(options.colors.foregroundSelected);
      }).mouseleave(function(){
        $(choice).css(options.colors.foreground);
      }).click(function(){
        closeMenu();
        options.onSelect.call($(choice));
      });
    });
    $('.ninjaMenuChoice:first-child', choices).ninjaRadius({corners:'top', radius:options.radius});
    $('.ninjaMenuChoice:last-child', choices).ninjaRadius({corners:'bottom', radius:options.radius});
    var button = $('.ninjaMenuButton', menu).ninjaButtonCreate({
      icon:options.icon,
      onDeselect:function(){
        $(choices).slideUp();
      },
      onSelect:function(){
        $(choices).mouseleave(function() {
          $(button).ninjaButtonDeselect({onDeselect:$(choices).slideUp()});
        }).slideDown();
        $(document).keyup(function(event) {
          if (event.keyCode == 27) { // esc key
            $(button).ninjaButtonDeselect({onDeselect:$(choices).slideUp()});
            $(document).unbind('keyup');
          }
        });
      },
      title:options.title
    }).append('&#160;<span class="ninjaMenuIcon"/>');
    $('.ninjaMenuIcon', button).ninjaIconCreate('down').css({height:$(button).height(), position:'relative', top:'-2px'});
    $(choices).ninjaRadius({radius:options.radius}).css({top:$(button).outerHeight()});
  });
};
