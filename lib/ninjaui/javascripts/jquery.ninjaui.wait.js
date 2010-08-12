$.extend($.nui, {
  framePosition: function(customOptions){
    var options = $.extend({
      frame:$('.nui-window-frame'),
      overlay:$('.nui-window')
    }, customOptions);
    var overlayMiddleHorizontal = parseInt($(options.overlay).width() / 2);
    var top;
    top = $(window).scrollTop();
    var overlayHeight = $(options.overlay).height();
    var overlayMiddleVertical;
    if(top > 0) {
      overlayMiddleVertical = parseInt((overlayHeight / 2) + top);
    }
    else if(overlayHeight > $(window).height()) {
      overlayMiddleVertical = parseInt($(window).height() / 2);
    }
    else {
      overlayMiddleVertical = parseInt(overlayHeight / 2);
    }
    var frameMiddleHorizontal = parseInt($(options.frame).innerWidth() / 2);
    var frameMiddleVertical = parseInt($(options.frame).innerHeight() / 2);
    var left = overlayMiddleHorizontal - frameMiddleHorizontal;
    left = (left > 0) ? left : 0;
    top = overlayMiddleVertical - frameMiddleVertical;
    top = (top > 0) ? top : 0;
    $(options.frame).css('left', left + 'px');
    $(options.frame).css('top', top + 'px');
  },
  waitStart: function(customOptions){
    var options = $.extend({
      content:'Updating...',
      object:$(document.body),
      onStop:function(){},
      seconds:0
    }, customOptions);
    $(options.object).css('position', 'relative').append('<div class="nui nui-wait">' +
      '<div class="nui-wait-frame">' +
        options.content + '<div class="nui-wait-reflection"></div>' +
      '</div>' +
    '</div>');
    var overlay = $('.nui-wait', options.object);
    var frame = $('.nui-wait-frame', overlay);
    $(overlay).fadeIn(function() {
      $(overlay).css('filter', 'progid:DXImageTransform.Microsoft.Gradient(StartColorStr=#80ffffff, EndColorStr=#80ffffff)');
      $.nui.framePosition({frame:frame, overlay:overlay});
      $(frame).fadeIn(function() {
        $(frame).css('filter', 'progid:DXImageTransform.Microsoft.Gradient(StartColorStr=#c0000000, EndColorStr=#c0000000)');
        if(options.seconds > 0) {
          var milliseconds = options.seconds * 1000;
          setTimeout(function() {
            $.nui.waitStop({
              object:$(options.object),
              onStop:options.onStop
            });
          }, milliseconds);
        }
      });
    });
  },
  waitStop: function(customOptions){
    var options = $.extend({
      object:$(document.body),
      onStop:function(){}
    }, customOptions);
    var overlay = $('.nui-wait', options.object);
    var frame = $('.nui-wait-frame', overlay);
    $(frame).fadeOut(function() {
      $(overlay).fadeOut(function() {
        options.onStop.call();
        $(overlay).remove();
      });
    });
  }
});
