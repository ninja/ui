$.extend($.fn.ninjaui, {
  iconCreate:function(customOptions) {
    var config = getConfig();
    var options = $.extend({
      icon:null,
      title:null
    }, customOptions);
    var icon;
    global.selected.each(function(i, target) {
      $(target).wrapInner('<span/>');
      $(target).text(options.title || '');
      if(options.icon) {
        $(target).attr('class', 'ninjauiIcon ninjauiIcon-' + options.icon.toLowerCase());
      }
    });
    return $(icon);
  }
});
