$.fn.ninjaFoldersCreate = function(customOptions) {
  var origin = this;
  var options = $.extend({
    colors:$.ninjaColorsGet(),
    direction:'horizontal',
    onChange:function(){},
    radius:$.ninjaRadius,
    selected:$(origin)[0]
  }, customOptions);
  var folders, tabs;
  if(options.direction == 'horizontal'){
    folders = this.wrapAll('<div class="ninjaFolders"/>').parent();
    tabs = $(folders).prepend('<div class="ninjaFoldersTabs"/>').children('.ninjaFoldersTabs');
  }
  else{
    var foldersColumn = this.wrapAll('<td class="ninjaFoldersColumn"/>').parent();
    tabs = $(foldersColumn).wrapAll('<table cellpadding="0" class="ninjaFolders"><tbody><tr/></tbody></table>').parent().prepend('<td><div class="ninjaFoldersTabs"/></td>').find('.ninjaFoldersTabs');
    folders = $(foldersColumn).closest('.ninjaFolders');
  };
  $(folders).data({options:options});
  this.each(function(i, folder){
    $(folder).addClass('ninjaFoldersFolder').css(options.colors.background);
    $(tabs).append('<span class="ninjaFoldersTab">' + $(folder).attr('title') + '</span>');
  });
  $('.ninjaFoldersTab:first-child', tabs).ninjaRadius({corners:'topLeft', radius:options.radius}).addClass('ninjaFoldersTabsFirst');
  if(options.direction == 'horizontal'){
    $('.ninjaFoldersTab:last-child', tabs).ninjaRadius({corners:'topRight', radius:options.radius});
  }
  else{
    $('.ninjaFoldersTab:last-child', tabs).ninjaRadius({corners:'bottomLeft', radius:options.radius});
  };
  $('.ninjaFoldersTab', tabs).each(function(i, tab) {
    $(tab).click(function() {
      $(origin).ninjaFoldersToggle({init:false, selected:$(origin)[i]});
    });
  });
  $(document).ready(function(){
    $('.ninjaFoldersFolder', folders).each(function(i, folder){
      $(folder).css('min-height', $(tabs).height());
    }).ninjaFoldersToggle();
  });
  return this;
};

$.fn.ninjaFoldersToggle = function(customOptions){
  var folders = this.parent().closest('.ninjaFolders');
  var options = $.extend($(folders).data().options, customOptions);
  if(options.init == false){
    options.onChange.call($(options.selected));
  };
  var position;
  this.each(function(i, folder) {
    if($(folder).attr('id') == $(options.selected).attr('id')){
      $(folder).show();
      position = i;
    }
    else{
      $(folder).hide();
    }
  });
  $('.ninjaFoldersTab', folders).each(function(i, tab) {
    if(position == i){
      $(tab).addClass('ninjaFoldersTabsSelected').css(options.colors.foregroundSelected);        
    }
    else{
      $(tab).removeClass('ninjaFoldersTabsSelected').css(options.colors.foreground);
    }
  });
  return this;
};
