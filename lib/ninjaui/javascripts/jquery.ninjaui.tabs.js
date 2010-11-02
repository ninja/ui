$.fn.ninjaTabsCreate = function(customOptions){
  var options = $.extend({
    colors:$.ninjaColorsGet(),
    id:null,
    onChange:function(){},
    radius:$.ninjaRadius,
    selected:this[0],
    side:null
  }, customOptions);
  var tabs = this.wrapAll('<span/>').parent().addClass('ninjaTabs').data({options:options});
  this.each(function(i, tab){
    $(tab).addClass('ninjaPlastic ninjaEnabled ninjaTab').click(function() {
      $(tabs).ninjaTabsToggle({init:false, selected:$(tab)});
    });
    if($(tab).attr('title')){
      $(tab).removeAttr('title').prepend('<span/>&#160;');
      $('span', tab).ninjaIconCreate($(tab).attr('title')).css({height:$(tab).height(), position:'relative', top:'-2px'});
    }
  });
  if(options.side == 'left'){
    $('.ninjaTab:first-child', tabs).ninjaRadius({corners:'left', radius:options.radius}).addClass('ninjaFirst');
  }
  else if(options.side == 'right'){
    $('.ninjaTab:last-child', tabs).ninjaRadius({corners:'right', radius:options.radius});
  }
  else{
    $('.ninjaTab:first-child', tabs).ninjaRadius({corners:'left', radius:options.radius}).addClass('ninjaFirst');
    $('.ninjaTab:last-child', tabs).ninjaRadius({corners:'right', radius:options.radius});
  }
  $('.ninjaTab:first-child', tabs).ninjaRadius({corners:'left', radius:options.radius}).addClass('ninjaFirst');
  $(tabs).ninjaTabsToggle();
  return this;
};

$.fn.ninjaTabsToggle = function(customOptions){
  return this.each(function(i, tabs){
    var options = $.extend($(tabs).data().options, customOptions);
    if(options.init === false){
      options.onChange.call($(options.selected));
    }
    options.onChange.call();
    $('.ninjaTab', tabs).each(function(i, tab){
      if($(options.selected).attr('id') == $(tab).attr('id')){
        $(tab).addClass('ninjaSelected').css(options.colors.foregroundSelected);        
      }
      else{
        $(tab).removeClass('ninjaSelected').css(options.colors.foreground);
      }
      var icon = $('.ninjaIcon', tab);
      if($(tab).ninjaLightness() < 125){
        $(icon).addClass('ninjaIconWhite').removeClass('ninjaIconBlack');
      }
      else{
        $(icon).addClass('ninjaIconBlack').removeClass('ninjaIconWhite');
      }
    });
  });
};
