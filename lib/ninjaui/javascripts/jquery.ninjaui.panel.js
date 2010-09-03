$.extend($.fn.ninjaui, {
  panelCreate:function(customOptions) {
    var config = getConfig();
    var options = $.extend({
      icon:null,
      title:null
    }, customOptions);
    return global.selected.each(function(i, panel) {
      $(panel).addClass('ninjauiPanel');
      if(options.title || options.icon){
        $(panel).prepend('<div class="ninjauiPanelBar"/>');
        $('.ninjauiPanelBar', panel).append('<span class="ninjauiPanelIcon"/>');
        $('.ninjauiPanelIcon', panel).ninjaui.iconCreate({icon:options.icon, title:options.title});
      }
    });
  }
});
