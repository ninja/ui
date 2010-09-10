$.fn.ninjaPanelCreate = function(customOptions) {
  var options = $.extend({
    icon:null,
    title:null
  }, customOptions);
  return this.each(function(i, panel) {
    $(panel).addClass('ninjaPanel');
    if(options.title || options.icon){
      $(panel).prepend('<div class="ninjaPanelBar"/>');
      $('.ninjaPanelBar', panel).append('<span class="ninjaPanelIcon"/>');
      $('.ninjaPanelIcon', panel).ninjaIconCreate({icon:options.icon, title:options.title});
    }
  });
};
