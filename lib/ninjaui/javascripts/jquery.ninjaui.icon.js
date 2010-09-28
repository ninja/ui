$.fn.ninjaIconCreate = function(customOptions) {
  var options = $.extend({
    icon:null,
    title:null
  }, customOptions);
  return this.each(function(i, icon){
    $(icon).text(options.title || '');
    if(options.icon){
      $(icon).addClass('ninjaIcon ninjaIcon-' + options.icon.toLowerCase());
      if($(icon).parent().ninjaColorLightness() < 125){
        $(icon).addClass('ninjaIconLight');
      }
      else{
        $(icon).addClass('ninjaIconDark');
      };
    };
  });
};
