$.fn.ninjaFoldersToggle = function(customOptions){
  var options = $.extend({
    onChange:function(){},
    selected:null
  }, customOptions);
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
  var folders = this.parent().closest('.ninjaFolders');
  $('.ninjaFoldersTab', folders).each(function(i, tab) {
    if(position == i){
      $(tab).addClass('ninjaFoldersTabSelected');        
    }
    else{
      $(tab).removeClass('ninjaFoldersTabSelected');
    }
  });
  options.onChange.call($(options.selected));
  return this;
};

$.fn.ninjaFoldersCreate = function(customOptions) {
  var options = $.extend({
    direction:'horizontal',
    onChange:function(){},
    selected:null
  }, customOptions);
  var origin = this;
  var selected = options.selected || $(origin)[0];
  var folders, tabs;
  if(options.direction == 'horizontal'){
    folders = this.wrapAll('<div class="ninjaFolders"/>').parent();
    tabs = $(folders).prepend('<div class="ninjaFoldersTabs"/>').children('.ninjaFoldersTabs');
  }
  else{
    folders = this.wrapAll('<td class="ninjaFoldersColumn"/>').parent();
    tabs = $(folders).wrapAll('<table cellpadding="0" class="ninjaFolders"><tbody><tr/></tbody></table>').parent().prepend('<td><div class="ninjaFoldersTabs"/></td>').find('.ninjaFoldersTabs');
  };
  this.each(function(i, folder){
    $(folder).addClass('ninjaFoldersFolder');
    $(tabs).append('<span class="ninjaFoldersTab">' + $(folder).attr('title') + '</span>');
  });
  $('.ninjaFoldersTab:first-child', tabs).addClass('ninjaFoldersTabFirst');
  $('.ninjaFoldersTab:last-child', tabs).addClass('ninjaFoldersTabLast');
  $('.ninjaFoldersTab', tabs).each(function(i, tab) {
    $(tab).click(function() {
      $(origin).ninjaFoldersToggle({onChange:options.onChange, selected:$(origin)[i]});
    });
  });
  $(document).ready(function(){
    $('.ninjaFoldersFolder', folders).each(function(i, folder){
      $(folder).css('min-height', $(tabs).height());
    }).ninjaFoldersToggle({selected:selected});
  });
  return this;
};
