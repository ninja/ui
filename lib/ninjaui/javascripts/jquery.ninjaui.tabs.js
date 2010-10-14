$.fn.ninjaTabsCreate = function(customOptions){
  var options = $.extend({
    colors:$.ninjaColors,
    id:null,
    onChange:function(){},
    radius:$.ninjaRadius,
    selected:this[0]
  }, customOptions);
  var tabs = this.wrapAll('<div/>').parent().addClass('ninjaTabs').data({options:options});
  this.each(function(i, tab){
    $(tab).addClass('ninjaTabsTab').click(function() {
      $(tabs).ninjaTabsToggle({init:false, selected:$(tab)});
    });
    var icon;
    if(icon = $(tab).attr('title')){
      $(tab).removeAttr('title').prepend('<span/>&#160;');
      $('span', tab).ninjaIconCreate(icon).css({height:$(tab).height(), position:'relative', top:'-2px'});
    }
  });
  $('.ninjaTabsTab:first-child', tabs).ninjaRadius({corners:'left', radius:options.radius}).addClass('ninjaTabsFirst');
  if(!$(tabs).parent().hasClass('ninjaNavigation')){
    $('.ninjaTabsTab:last-child', tabs).ninjaRadius({corners:'right', radius:options.radius});
  };
  $(tabs).ninjaTabsToggle();
  return this;
};

$.fn.ninjaTabsToggle = function(customOptions){
  return this.each(function(i, tabs){
    var options = $.extend($(tabs).data().options, customOptions);
    if(options.init == false){
      options.onChange.call($(options.selected));
    };
    options.onChange.call();
    $('.ninjaTabsTab', tabs).each(function(i, tab){
      if($(options.selected).attr('id') == $(tab).attr('id')){
        $(tab).addClass('ninjaTabsSelected').css(options.colors.foregroundSelected);        
      }
      else{
        $(tab).removeClass('ninjaTabsSelected').css(options.colors.foreground);
      }
      var icon = $('.ninjaIcon', tab);
      if($(tab).ninjaLightness() < 125){
        $(icon).addClass('ninjaIconWhite').removeClass('ninjaIconBlack');
      }
      else{
        $(icon).addClass('ninjaIconBlack').removeClass('ninjaIconWhite');
      };
    });
  });
};
