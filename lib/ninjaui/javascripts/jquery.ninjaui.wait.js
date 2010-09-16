$.ninjaWaitStart = function(customOptions){
  var options = $.extend({
    id:null,
    onStop:function(){},
    seconds:0,
    text:'Updating...'
  }, customOptions);
  var wait = $(document.body).append('<div class="ninjaWait"/>');
  $(wait).attr('id', options.id).append('<div class="ninjaWaitOverlay"/><div class="ninjaWaitFrame"/>');
  var overlay = $('.ninjaWaitOverlay', wait).css({filter:'alpha(opacity = 0)', opacity:0});
  var frame = $('.ninjaWaitFrame', wait).append('<div class="ninjaWaitReflection"/>');
  var offset = null;
  if(!navigator.userAgent.toLowerCase().match(/(iphone|ipod|ipad)/)){
    offset = '0 ' + $(window).scrollTop();
  };
  $(overlay).css({
    height:$(document.body).height(),
    width:$(window).width()
  }).animate({filter:'alpha(opacity = 5)', opacity:0.5}, function() {
    $(frame).text(options.text).position({
      at:'center',
      collision:'fit none',
      of:window,
      offset:offset,
      my:'center'
    }).fadeIn(function() {
      if(options.seconds > 0) {
        var milliseconds = options.seconds * 1000;
        setTimeout(function() {
          $(wait).ninjaWaitStop({onStop:options.onStop});
        }, milliseconds);
      }
    });
  });
  return this;
};

$.fn.ninjaWaitStop = function(customOptions){
  var options = $.extend({
    onStop:function(){}
  }, customOptions);
  return this.each(function(i, wait){
    var overlay = $('.ninjaWaitOverlay', wait);
    var frame = $('.ninjaWaitFrame', wait);
    $(frame).fadeOut(function() {
      $(overlay).fadeOut(function() {
        options.onStop.call();
        $(frame).remove();
        $(overlay).remove();
      });
    });
  });
};
