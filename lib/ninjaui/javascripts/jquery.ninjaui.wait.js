$.extend($.ninjaui, {
  waitStart: function(customOptions){
    var options = $.extend({
      onStop:function(){},
      seconds:0,
      text:'Updating...'
    }, customOptions);
    $(document.body).append('<div class="ninjauiWaitOverlay"/><div class="ninjauiWaitFrame"/>');
    var overlay = $('.ninjauiWaitOverlay').css({filter:'alpha(opacity = 0)', opacity:0});
    var frame = $('.ninjauiWaitFrame').append('<div class="ninjauiWaitReflection"/>');
    $(overlay).css({
      height:$(document.body).height(),
      width:$(window).width()
    }).animate({filter:'alpha(opacity = 5)', opacity:0.5}, function() {
      $(frame).text(options.text).position({
        at:'center',
        collision:'fit none',
        of:window,
        offset:'0 ' + $(window).scrollTop(),
        my:'center'
      }).fadeIn(function() {
        if(options.seconds > 0) {
          var milliseconds = options.seconds * 1000;
          setTimeout(function() {
            $.ninjaui.waitStop({frame:frame, onStop:options.onStop, overlay:overlay});
          }, milliseconds);
        }
      });
    });
  },
  waitStop: function(customOptions){
    var options = $.extend({
      frame:null,
      onStop:function(){},
      overlay:null
    }, customOptions);
    $(options.frame).fadeOut(function() {
      $(options.overlay).fadeOut(function() {
        options.onStop.call();
        $(options.frame).remove();
        $(options.overlay).remove();
      });
    });
  }
});
