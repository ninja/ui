$.fn.ninjaNavigationCreate = function(customOptions) {
  var options = $.extend({
    colors:$.ninjaColors,
    radius:$.ninjaRadius
  }, customOptions);
  return this.each(function(i, navigation){
    $(navigation).addClass('ninjaNavigation').css(options.colors.foreground).ninjaRadius({radius:options.radius});
  });
};
