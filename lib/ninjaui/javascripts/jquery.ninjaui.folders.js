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
  $('.ninjaFoldersTab', $('.ninjaFoldersTabs', this.parent())).each(function(i, tab) {
    if(position == i){
      $(tab).addClass('ninjaFoldersTabClicked');        
    }
    else{
      $(tab).removeClass('ninjaFoldersTabClicked');
    }
  });
  options.onChange.call($(options.selected));
  return this;
};

$.fn.ninjaFoldersCreate = function(customOptions) {
  var options = $.extend({
    direction:'horizontal',
    id:null,
    onChange:function(){},
    selected:null
  }, customOptions);
  var origin = this;
  var selected = options.selected || $(origin)[0];
  var folders = this.wrapAll('<div/>').parent().addClass('ninjaFolders ninjaFolders-' + options.direction).attr('id', options.id);
  var tabs = $(folders).prepend('<div class="ninjaFoldersTabs"></div>').children('.ninjaFoldersTabs');
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
    $(origin).each(function(i, folder){
      $(folder).css('min-height', $(tabs).height());
    }).ninjaFoldersToggle({selected:selected});
  });
  return this;
};
