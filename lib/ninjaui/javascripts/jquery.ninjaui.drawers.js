$.extend($.ninjaui, {
  drawerClose: function(customOptions){
    var options = $.extend({
      onClose:function(){},
      drawer:$('.ninjauiDrawer')
    }, customOptions);
    var handle = $(options.drawer).prev('.ninjauiDrawerHandle');
    var icon = $('.ninjauiIcon', handle);
    $(options.drawer).slideUp(function() {
      $(handle).removeClass('ninjauiClicked').toggleClass('ninjauiLast', $(options.drawer).is('.ninjauiLast'));
      $(icon).addClass('ninjauiIcon-right').removeClass('ninjauiIcon-down');
    });
    options.onClose.call(options.drawer);
  },
  drawerOpen: function(customOptions){
    var options = $.extend({
      drawer:$('.ninjauiDrawer'),
      onOpen:function(){}
    }, customOptions);
    var handle = $(options.drawer).prev('.ninjauiDrawerHandle');
    var icon = $('.ninjauiIcon', handle);
    $(handle).addClass('ninjauiClicked').removeClass('ninjauiLast');
    $(icon).addClass('ninjauiIcon-down').removeClass('ninjauiIcon-right');
    $(options.drawer).slideDown();
    options.onOpen.call(options.drawer);
  },
  drawersClose: function(drawers){
    $.each(drawers, function(i, drawer) {
      $.ninjaui.drawerClose({drawer:drawer});
    });
  },
  drawersOpen: function(drawers){
    $.each(drawers, function(i, drawer) {
      $.ninjaui.drawerOpen({drawer:drawer});
    });
  }
});

$.extend($.fn.ninjaui, {
  drawersCreate: function(customOptions){
    var config = getConfig();
    var options = $.extend({
      drawer:null,
      onClose:function(){},
      onOpen:function(){}
    }, customOptions);
    var wrapper = $(global.selected).wrapAll('<div/>').parent();
    $(wrapper).addClass('ninjauiDrawers');
    global.selected.each(function(i, drawers) {
      $(drawers).children('div').each(function(i, drawer){
        icon = $(drawer).hide().addClass('ninjauiDrawer').before('<span/>').prev('span');
        $(icon).addClass('ninjauiIcon ninjauiIcon-right').text($(drawer).attr('title'));
        handle = $(icon).wrap('<div/>').parent().addClass('ninjauiDrawerHandle');
        if(i == 0){
          $(handle).addClass('ninjauiFirst');
        }
        $(handle).click(function() {
          options.drawer = $(drawer);
          if($(this).hasClass('ninjauiClicked')) {
            $.ninjaui.drawerClose(options);
          }
          else {
            $.ninjaui.drawerOpen(options);
          }
        });
      });
      $(drawers).children('div').last().addClass('ninjauiLast');
      $(handle).addClass('ninjauiLast');
    });
    return $(wrapper);
  }
});
