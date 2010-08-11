$.nui.extend({
  windowClose: function(customOptions){
    var options = $.extend({
      onClose:function(){}
    }, customOptions);
    var overlay = $('.nui-window');
    var frame = $('.nui-window-frame');
    $(frame).fadeOut(function() {
      $(overlay).fadeOut(function() {
        options.onClose.call();
        $(frame).remove();
        $(overlay).remove();
      });
    });
  },
  windowOpen: function(customOptions){
    var options = $.extend({
      onClose:function(){},
      onOpen:function(){},
      title:'Untitled',
      url:''
    }, customOptions);
    $(document.body).append('<div class="nui-window"></div>' +
      '<div class="nui nui-window-frame">' +
        '<div class="nui-bar"><span class="nui-window-title">' +
          options.title + '</span><button class="nui-button nui-window-close"><span class="nui-icon nui-icon-close"></span></button>' +
        '</div>' +
        '<div class="nui-window-content"></div>' +
        '<div class="nui-window-reflection"></div>' +
      '</div>').keyup(function(event) {
      if (event.keyCode == 27) { // esc key
        $.nui.windowClose(options);
      }
    });
    var overlay = $('.nui-window');
    $(window).resize(function() {
      $.nui.framePosition({frame:$(frame), overlay:$(overlay)});
    });
    var frame = $('.nui-window-frame');
    var handle = $('.nui-window-handle', frame);
    $(frame).click(function(event) {
      event.stopPropagation();
    }).draggable({
      containment:$(overlay),
      cursor:'pointer',
      handle:$(handle)
    });
    var content = $('.nui-window-content', frame);
    $(content).load(options.url, function() {
      $('.nui-window-close', frame).click(function() {
        $.nui.windowClose(options);
      });
      $(overlay).css('filter', 'alpha(opacity = 75)').fadeIn(function() {
        $.nui.framePosition({frame:$(frame), overlay:$(overlay)});
        $(frame).fadeIn(function() {
          options.onOpen.call(content);
        });
      });
    });
  },
  windowRetitle: function(customOptions){
    var options = $.extend({
      onRetitle:function(){},
      title:'Untitled'
    }, customOptions);
    var title = $('.nui-window-title');
    $(title).text(options.title, function() {
      options.onRetitle.call();
    });
  }
});

$.fn.nuiWindow = function(customOptions) {
  var options = $.extend({}, customOptions);
  return this.each(function(i, opener) {
    $(opener).click(function(event) {
      event.preventDefault();
      if($(opener).is('a') && !$(opener).attr('name')) {
        options.url = $(opener).attr('href');
      }
      else {
        options.url = $(opener).attr('name');
      }
      options.title = $(opener).attr('title');
      $.nui.windowOpen(options);
    });
  });
};
