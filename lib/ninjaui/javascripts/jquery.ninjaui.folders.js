$.extend($.ninjaui, {
  foldersToggle: function(customOptions){
    var options = $.extend({
      folders:null,
      onChange:function(){},
      selected:null
    }, customOptions);
    var position;
    $('.ninjauiFoldersFolder', options.folders).each(function(i, folder) {
      if($(folder).attr('id') == $(options.selected).attr('id')){
        $(folder).show();
        position = i;
      }
      else{
        $(folder).hide();
      }
    });
    $('.ninjauiFoldersTab', options.folders).each(function(i, tab) {
      if(position == i){
        $(tab).addClass('ninjauiClicked');        
      }
      else{
        $(tab).removeClass('ninjauiClicked');
      }
    });
    options.onChange.call(options.selected);
  }
});

$.extend($.fn.ninjaui, {
  foldersCreate:function(customOptions) {
    var config = getConfig();
    var options = $.extend({
      direction:'horizontal',
      id:null,
      onChange:function(){},
      selected:null
    }, customOptions);
    var files = $(global.selected);
    var folders = $(files).wrapAll('<div/>').parent().addClass('ninjauiFolders ninjauiFolders-' + options.direction).attr('id', options.id);
    var tabs = $(folders).prepend('<div class="ninjauiFoldersTabs"></div>').children('.ninjauiFoldersTabs');
    $(files).each(function(i, folder){
      $(folder).addClass('ninjauiFoldersFolder');
      $(tabs).append('<span class="ninjauiFoldersTab">' + $(folder).attr('title') + '</span>');
    });
    $('.ninjauiFoldersTab:first-child', tabs).addClass('ninjauiFirst');
    $('.ninjauiFoldersTab:last-child', tabs).addClass('ninjauiLast');
    $('.ninjauiFoldersTab', tabs).each(function(i, tab) {
      $(tab).click(function() {
        $.ninjaui.foldersToggle({folders:$(folders), onChange:options.onChange, selected:$(files)[i]});
      });
    });
    $(document).ready(function(){
      $(files).each(function(i, folder){
        $(folder).css('min-height', $(tabs).height());
      });
    });
    $.ninjaui.foldersToggle({folders:$(folders), onChange:options.onChange, selected:$(options.selected) || $(files)[0]});
    return $(folders);
  }
});
