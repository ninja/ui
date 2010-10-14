$.ninjaWaitStart = function(customOptions){
  var options = $.extend({
    colors:$.ninjaColors,
    id:null,
    onStop:function(){},
    radius:$.ninjaRadius,
    seconds:0,
    text:'Updating...'
  }, customOptions);
  $(document.body).append('<div class="ninjaWaitOverlay"/><div class="ninjaWaitFrame"/>');
  var overlay = $('.ninjaWaitOverlay').css({opacity:0});
  var frame = $('.ninjaWaitFrame').attr('id', options.id).css(options.colors.background).text(options.text).prepend('<span class="ninjaWaitIcon"/>&#160;').ninjaRadius({radius:options.radius}).append('<div class="ninjaWaitReflection"/>').data({options:options});
  ;
  $('.ninjaWaitReflection').css(options.colors.background).ninjaRadius({radius:options.radius}).position({
    at:'left bottom',
    of:frame,
    my:'left top'
  }).css({opacity:0.125});
  if($(frame).ninjaLightness() < 125){
    $(overlay).css({backgroundColor:'#fff'});
  }
  else{
    $(overlay).css({backgroundColor:'#000'});
  };
  var icon = $('.ninjaWaitIcon', frame);
  var offset = null;
  if(!navigator.userAgent.toLowerCase().match(/(iphone|ipod|ipad)/)){
    offset = '0 ' + $(window).scrollTop();
  };
  $(overlay).css({
    height:$(document.body).height(),
    width:$(window).width()
  }).animate({opacity:0.5}, function() {
    $(frame).position({
      at:'center',
      collision:'fit none',
      of:window,
      offset:offset,
      my:'center'
    }).fadeIn(function() {
      $(icon).ninjaIconAnimate({frames:12});
      if(options.seconds > 0) {
        var milliseconds = options.seconds * 1000;
        setTimeout(function() {
          $(frame).ninjaWaitStop();
        }, milliseconds);
      }
    });
  });
  return this;
};

$.fn.ninjaWaitStop = function(){
  return this.each(function(i, frame){
    var options = $(frame).data().options;
    var overlay = $(frame).prev('.ninjaWaitOverlay');
    $(frame).fadeOut(function() {
      $(overlay).fadeOut(function() {
        options.onStop.call();
        $(frame).remove();
        $(overlay).remove();
      });
    });
  });
};
