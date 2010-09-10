$.fn.ninjaTabsCreate = function(customOptions){
  var options = $.extend({
    id:null,
    onChange:function(){},
    selected:null
  }, customOptions);
  var origin = this;
  var tabs = this.wrapAll('<div/>').parent().addClass('ninjaTabs').attr('id', options.id);
  this.each(function(i, tab){
    $(tab).addClass('ninjaTabsTab').click(function() {
      $(origin).ninjaTabsToggle({onChange:options.onChange, selected:$(tab)});
    });
    var icon;
    if(icon = $(tab).attr('title')){
      title = $(tab).text();
      $(tab).removeAttr('title').html('<span/>');
      $('span', tab).ninjaIconCreate({icon:icon, title:title});
    }
  });
  $('.ninjaTabsTab:first-child', tabs).addClass('ninjaTabsFirst');
  $('.ninjaTabsTab:last-child', tabs).addClass('ninjaTabsLast');
  this.ninjaTabsToggle({onChange:options.onChange, selected:options.selected || this[0]});
  return this;
};

$.fn.ninjaTabsToggle = function(customOptions){
  var options = $.extend({
    onChange:function(){},
    selected:null
  }, customOptions);
  return this.each(function(i, tab){
    if($(options.selected).attr('id') == $(tab).attr('id')){
      $(tab).addClass('ninjaTabsClicked');        
    }
    else{
      $(tab).removeClass('ninjaTabsClicked');
    }
    options.onChange.call();
  });
};
