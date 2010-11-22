$.fn.ninjaDrawersCreate = function(customOptions){
  var options = $.extend({
    colors:$.ninjaColorsGet(),
    onClose:function(){},
    onOpen:function(){},
    radius:$.ninjaRadius,
    selected:null
  }, customOptions);
  this.each(function(i, drawer){
    $(drawer).data({options:options});
    $(drawer).hide().addClass('ninjaPaper').css(options.colors.background).before('<div/>');
    var handle = $(drawer).prev('div').addClass('ninjaPlastic ninjaEnabled').css(options.colors.foreground).text($(drawer).attr('title')).prepend('<span/>&#160;');
    $('span', handle).ninjaIconCreate('right').position({
      at:'left center',
      of:handle,
      offset:$(handle).css('padding-left') + ' 0',
      my:'left center'
    });
    $(handle).click(function() {
      if($(handle).hasClass('ninjaSelected')) {
        $(drawer).ninjaDrawersClose();
      }
      else {
        $(drawer).ninjaDrawersOpen();
      }
    });
  });
  this.first().prev('div.ninjaPlastic').ninjaRadius({corners:'top', radius:options.radius});
  this.last().css({borderBottomStyle:'solid'}).ninjaRadius({corners:'bottom', radius:options.radius}).prev('div.ninjaPlastic').ninjaRadius({corners:'bottom', radius:options.radius}).addClass('ninjaLast');
  if(options.selected != null){
    $(options.selected).ninjaDrawersOpen();
  }
  return this;
};

$.fn.ninjaDrawersClose = function(){
  return this.each(function(i, drawer){
    var options = $(drawer).data().options;
    options.onClose.call(drawer);
    var handle = $(drawer).prev('div.ninjaPlastic');
    var icon = $('span.ninjaIcon', handle);
    $(drawer).slideUp(function(){
      $(handle).removeClass('ninjaSelected').css(options.colors.foreground);
      $(icon).addClass('ninjaIcon-right').removeClass('ninjaIcon-down');
      if($(handle).hasClass('ninjaLast')){
        $(handle).ninjaRadius({corners:'bottom', radius:options.radius});
      }
    });
  });
};

$.fn.ninjaDrawersOpen = function(){
  return this.each(function(i, drawer) {
    var options = $(drawer).data().options;
    options.onOpen.call(drawer);
    var handle = $(drawer).prev('div.ninjaPlastic');
    var icon = $('span.ninjaIcon', handle);
    $(handle).addClass('ninjaSelected').css(options.colors.foregroundSelected);
    $(icon).addClass('ninjaIcon-down').removeClass('ninjaIcon-right');
    $(drawer).slideDown();
    if($(handle).hasClass('ninjaLast')){
      $(handle).ninjaRadius({radius:'0'});
    }
  });
};
