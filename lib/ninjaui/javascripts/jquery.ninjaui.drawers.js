$.fn.ninjaDrawersCreate = function(customOptions){
  var options = $.extend({
    onClose:function(){},
    onOpen:function(){}
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
      if($(handle).hasClass('ninjaDrawersHandleClicked')) {
        $(drawer).ninjaDrawersClose(options);
      }
      else {
        $(drawer).ninjaDrawersOpen(options);
      }
    });
  });
  this.first().addClass('ninjaDrawersDrawerFirst').prev('.ninjaDrawersHandle').addClass('ninjaDrawersHandleFirst');
  this.last().addClass('ninjaDrawersDrawerLast').prev('.ninjaDrawersHandle').addClass('ninjaDrawersHandleLast');
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
      $(handle).removeClass('ninjaDrawersHandleClicked');
      $(icon).addClass('ninjaIcon-right').removeClass('ninjaIcon-down');
    });
  });
  options.onClose.call();
  return this;
};

$.fn.ninjaDrawersOpen = function(customOptions){
  var options = $.extend({
    onOpen:function(){}
  }, customOptions);
  this.each(function(i, drawer) {
    var handle = $(drawer).prev('.ninjaDrawersHandle');
    var icon = $('.ninjaDrawersHandleIcon', handle);
    $(handle).addClass('ninjaDrawersHandleClicked');
    $(icon).addClass('ninjaIcon-down').removeClass('ninjaIcon-right');
    $(drawer).slideDown();
  });
  options.onOpen.call();
  return this;
};
