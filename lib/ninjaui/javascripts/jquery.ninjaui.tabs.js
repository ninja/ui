$.extend($.ninjaui, {
  tabsToggle: function(customOptions){
    var options = $.extend({
      tabs:null,
      onChange:function(){},
      selected:null
    }, customOptions);
    $('.ninjauiTabsTab', options.tabs).each(function(i, tab) {
      if($(options.selected).attr('id') == $(tab).attr('id')){
        $(tab).addClass('ninjauiTabsClicked');        
      }
      else{
        $(tab).removeClass('ninjauiTabsClicked');
      }
    });
    options.onChange.call(options.selected);
  }
});

$.extend($.fn.ninjaui, {
  tabsCreate:function(customOptions) {
    var config = getConfig();
    var options = $.extend({
      id:null,
      onChange:function(){},
      selected:null
    }, customOptions);
    var origin = $(global.selected);
    var tabs = $(origin).wrapAll('<div/>').parent().addClass('ninjauiTabs').attr('id', options.id);
    $(origin).each(function(i, tab){
      $(tab).addClass('ninjauiTabsTab').click(function() {
        $.ninjaui.tabsToggle({onChange:options.onChange, selected:$(tab), tabs:$(tabs)});
      });
      var icon;
      if(icon = $(tab).attr('title')){
        title = $(tab).text();
        $(tab).removeAttr('title').html('<span/>');
        $('span', tab).ninjaui.iconCreate({icon:icon, title:title});
      }
    });
    $('.ninjauiTabsTab:first-child', tabs).addClass('ninjauiTabsFirst');
    $('.ninjauiTabsTab:last-child', tabs).addClass('ninjauiTabsLast');
    $.ninjaui.tabsToggle({onChange:options.onChange, selected:options.selected || $(tabs)[0], tabs:$(tabs)});
    return $(tabs);
  }
});
