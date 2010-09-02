$.extend($.ninjaui, {
  foldersToggle: function(customOptions){
    var options = $.extend({
      folders:null,
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
  }
});

$.extend($.fn.ninjaui, {
  foldersCreate:function(customOptions) {
    var config = getConfig();
    var options = $.extend({
      direction:'horizontal',
      id:null,
      selected:null
    }, customOptions);
    var wrapper = $(global.selected).wrapAll('<div/>').parent().addClass('ninjauiFolders ninjauiFolders-' + options.direction).attr('id', options.id);
    global.selected.each(function(i, folders) {
      var folderArray = $(folders).children('div').each(function(i, folder) {
        $(folder).addClass('ninjauiFoldersFolder');
      });
      var tabs = $(wrapper).prepend('<div class="ninjauiFoldersTabs"></div>').children('.ninjauiFoldersTabs');
      $(folderArray).each(function(i, folder) {
        $(tabs).append('<span class="ninjauiFoldersTab">' + $(folder).attr('title') + '</span>');
      }).each(function(i, folder) {
        $(folder).css('min-height', $(tabs).height());
      });
      $('.ninjauiFoldersTab:first-child', tabs).addClass('ninjauiFirst');
      $('.ninjauiFoldersTab:last-child', tabs).addClass('ninjauiLast');
      $('.ninjauiFoldersTab', tabs).each(function(i, tab) {
        $(tab).click(function() {
          $.ninjaui.foldersToggle({folders:$(wrapper), selected:$(folderArray)[i]});
        });
      });
      $.ninjaui.foldersToggle({folders:$(wrapper), selected:$(options.selected) || $(folderArray)[0]});
    });
    return $(wrapper);
  }
});
