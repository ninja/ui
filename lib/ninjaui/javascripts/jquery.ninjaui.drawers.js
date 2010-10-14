$.fn.ninjaDrawersCreate = function(customOptions){
  var options = $.extend({
    colors:$.ninjaColors,
    onClose:function(){},
    onOpen:function(){},
    radius:$.ninjaRadius,
    selected:null
  }, customOptions);
  this.wrapAll('<div class="ninjaDrawers"/>').each(function(i, drawer){
    $(drawer).data({options:options});
    $(drawer).hide().addClass('ninjaDrawersDrawer').css(options.colors.background).before('<div/>');
    var handle = $(drawer).prev('div').addClass('ninjaDrawersHandle').css(options.colors.foreground).text($(drawer).attr('title')).prepend('<span class="ninjaDrawersHandleIcon"/>&#160;');
    $('.ninjaDrawersHandleIcon', handle).ninjaIconCreate('right').position({
      at:'left center',
      of:handle,
      offset:$(handle).css('padding-left') + ' 0',
      my:'left center'
    });
    $(handle).click(function() {
      if($(handle).hasClass('ninjaDrawersHandleSelected')) {
        $(drawer).ninjaDrawersClose();
      }
      else {
        $(drawer).ninjaDrawersOpen();
      }
    });
  });
  this.first().prev('.ninjaDrawersHandle').ninjaRadius({corners:'top', radius:options.radius});
  this.last().css({borderBottomStyle:'solid'}).ninjaRadius({corners:'bottom', radius:options.radius}).prev('.ninjaDrawersHandle').ninjaRadius({corners:'bottom', radius:options.radius}).addClass('ninjaDrawersHandleLast');
  return this;
};

$.fn.ninjaDrawersClose = function(){
  return this.each(function(i, drawer){
    var options = $(drawer).data().options;
    options.onClose.call(drawer);
    var handle = $(drawer).prev('.ninjaDrawersHandle');
    var icon = $('.ninjaDrawersHandleIcon', handle);
    $(drawer).slideUp(function(){
      $(handle).removeClass('ninjaDrawersHandleSelected').css(options.colors.foreground);
      $(icon).addClass('ninjaIcon-right').removeClass('ninjaIcon-down');
      if($(handle).hasClass('ninjaDrawersHandleLast')){
        $(handle).ninjaRadius({corners:'bottom', radius:options.radius});
      };
    });
  });
};

$.fn.ninjaDrawersOpen = function(){
  return this.each(function(i, drawer) {
    var options = $(drawer).data().options;
    options.onOpen.call(drawer);
    var handle = $(drawer).prev('.ninjaDrawersHandle');
    var icon = $('.ninjaDrawersHandleIcon', handle);
    $(handle).addClass('ninjaDrawersHandleSelected').css(options.colors.foregroundSelected);
    $(icon).addClass('ninjaIcon-down').removeClass('ninjaIcon-right');
    $(drawer).slideDown();
    if($(handle).hasClass('ninjaDrawersHandleLast')){
      $(handle).ninjaRadius({radius:'0'});
    };
  });
};
