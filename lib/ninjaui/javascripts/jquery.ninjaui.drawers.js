$.extend($.ninjaui, {
  drawerClose: function(drawer){
    var handle = $(drawer).prev('.nui-drawer-handle');
    var icon = $('.nui-icon', handle);
    $(drawer).slideUp(function() {
      $(handle).removeClass('nui-active').toggleClass('nui-last', $(drawer).is('.nui-last'));
      $(icon).addClass('nui-icon-right').removeClass('nui-icon-down');
    });
  },
  drawerOpen: function(drawer){
    var handle = $(drawer).prev('.nui-drawer-handle');
    var icon = $('.nui-icon', handle);
    $(handle).addClass('nui-active').removeClass('nui-last');
    $(icon).addClass('nui-icon-down').removeClass('nui-icon-right');
    $(drawer).slideDown();
  },
  drawersClose: function(drawers){
    $.each(drawers, function(i, drawer) {
      $.ninjaui.drawerClose(drawer);
    });
  },
  drawersOpen: function(drawers){
    $.each(drawers, function(i, drawer) {
      $.ninjaui.drawerOpen(drawer);
    });
  }
});

$.extend($.fn.ninjaui, {
  drawersCreate: function(customOptions){
    var config = getConfig();
    var options = $.extend({}, customOptions);
    return global.selected.each(function(i, drawers) {
      $(drawers).children('div').each(function(i, newDrawer) {
        $(newDrawer).addClass('nui-drawer');
      });
      $(drawers).addClass('nui nui-drawers');
      $('.nui-drawer:last', drawers).addClass('nui-last');
      $('.nui-drawer', drawers).each(function(i, drawer) {
        $(drawer).before('<div class="nui-drawer-handle"><span class="nui-icon nui-icon-right"></span> ' + $(drawer).attr('title') + '</div>');
        var handle = $(drawer).prev('.nui-drawer-handle');
        $(handle).toggleClass('nui-last', $(drawer).is('.nui-last'));
        $(drawer).hide();
        $(handle).click(function() {
          if($(handle).hasClass('nui-active')) {
            $.ninjaui.drawerClose(drawer);
          }
          else {
            $.ninjaui.drawerOpen(drawer);
          }
        });
      });
      $('.nui-drawer-handle:first-child', drawers).addClass('nui-first');
    });
  }
});
