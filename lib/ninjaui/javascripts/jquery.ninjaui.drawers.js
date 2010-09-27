$.fn.ninjaDrawersCreate = function(customOptions){
  var options = $.extend({
    onClose:function(){},
    onOpen:function(){},
    selected:null
  }, customOptions);
  this.wrapAll('<div class="ninjaDrawers"/>').each(function(i, drawer){
    $(drawer).addClass('ninjaDrawersDrawer').hide().before('<div/>');
    var handle = $(drawer).prev('div').addClass('ninjaDrawersHandle').append('<span class="ninjaDrawersHandleIcon"/>');
    var icon = $('.ninjaDrawersHandleIcon', handle);
    $(icon).ninjaIconCreate({
      icon:'right',
      title:$(drawer).attr('title')
    });
    $(handle).click(function() {
      if($(handle).hasClass('ninjaDrawersHandleSelected')) {
        $(drawer).ninjaDrawersClose(options);
      }
      else {
        $(drawer).ninjaDrawersOpen(options);
      }
    });
  });
  this.first().addClass('ninjaDrawersDrawerFirst').prev('.ninjaDrawersHandle').addClass('ninjaDrawersHandleFirst');
  this.last().addClass('ninjaDrawersDrawerLast').prev('.ninjaDrawersHandle').addClass('ninjaDrawersHandleLast');
  $(options.selected).each(function(i, drawer){
    $(drawer).ninjaDrawersOpen(options);
  });
  return this;
};

$.fn.ninjaDrawersClose = function(customOptions){
  var options = $.extend({
    onClose:function(){}
  }, customOptions);
  this.each(function(i, drawer){
    var handle = $(drawer).prev('.ninjaDrawersHandle');
    var icon = $('.ninjaDrawersHandleIcon', handle);
    $(drawer).slideUp(function(){
      $(handle).removeClass('ninjaDrawersHandleSelected');
      $(icon).addClass('ninjaIcon-right').removeClass('ninjaIcon-down');
      options.onClose.call(drawer);
    });
  });
  return this;
};

$.fn.ninjaDrawersOpen = function(customOptions){
  var options = $.extend({
    onOpen:function(){}
  }, customOptions);
  this.each(function(i, drawer) {
    var handle = $(drawer).prev('.ninjaDrawersHandle');
    var icon = $('.ninjaDrawersHandleIcon', handle);
    $(handle).addClass('ninjaDrawersHandleSelected');
    $(icon).addClass('ninjaIcon-down').removeClass('ninjaIcon-right');
    $(drawer).slideDown();
    options.onOpen.call(drawer);
  });
  return this;
};
