$.fn.ninjaPanelCreate = function(customOptions) {
  var options = $.extend({
    colors:$.ninjaColorsGet(),
    icon:null,
    radius:$.ninjaRadius,
    title:null
  }, customOptions);
  return this.each(function(i, panel) {
    $(panel).addClass('ninjaPaper ninjaPanel').css(options.colors.background).ninjaRadius({radius:options.radius});
    if(options.icon || options.title){
      $(panel).prepend('<div class="ninjaPanelBar ninjaPlastic"/>');
      var bar = $('.ninjaPanelBar', panel).css(options.colors.foreground).ninjaRadius({corners:'top', radius:options.radius});
      if(options.title){
        $(bar).text(options.title);
      }
      if(options.icon){
        if(options.title){
          $(bar).prepend('&#160;');
        }
        $(bar).prepend('<span class="ninjaPanelIcon"/>');
        $('.ninjaPanelIcon', panel).ninjaIconCreate(options.icon).css({height:$(bar).height(), position:'relative', top:'-2px'});
      }
    }
  });
};
