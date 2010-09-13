$.ninjaWindowOpen = function(customOptions){
  var options = $.extend({
    id:null,
    onClose:function(){},
    onOpen:function(){},
    title:null,
    url:null
  }, customOptions);
  $(document.body).append('<div class="ninjaWindow"/>');
  var ninjaWindow = $('.ninjaWindow').attr('id', options.id).append('<div class="ninjaWindowOverlay"/><div class="ninjaWindowFrame"/>');
  var overlay = $('.ninjaWindowOverlay', ninjaWindow).css({filter:'alpha(opacity = 0)', opacity:0});
  var frame = $('.ninjaWindowFrame', ninjaWindow).append('<div class="ninjaWindowHandle"/><div class="ninjaWindowContent"/><div class="ninjaWindowReflection"/>');
  var handle = $('.ninjaWindowHandle', frame).append('<span class="ninjaWindowTitle"/><span class="ninjaWindowClose"/>');
  var title = $('.ninjaWindowTitle', handle).ninjaIconCreate({icon:options.icon, title:options.title});
  var button = $('.ninjaWindowClose', handle).ninjaButtonCreate({icon:'close', onClick:function(){
    $(ninjaWindow).ninjaWindowClose({onClose:options.onClose});
  }});
  var content = $('.ninjaWindowContent', frame);
  $(window).keyup(function(event) {
    if (event.keyCode == 27) { // esc key
      $(ninjaWindow).ninjaWindowClose({onClose:options.onClose});
    }
  });
  $(frame).click(function(event) {
    event.stopPropagation();
  }).draggable({
    containment:'document',
    cursor:'pointer',
    handle:$(handle)
  });
  $(content).load(options.url, function() {
    $(overlay).css({
      height:$(document.body).height(),
      width:$(window).width()
    }).animate({filter:'alpha(opacity = 5)', opacity:0.5}, function() {
      $(frame).position({
        at:'center',
        collision:'fit none',
        of:window,
        offset:'0 ' + $(window).scrollTop(),
        my:'center'
      }).fadeIn(function() {
        options.onOpen.call(content);
      });
    });
    $(handle).width($(frame).width());
    $(content).innerWidth($(frame).width());
  });
  return ninjaWindow;
};

$.fn.ninjaWindowClose = function(customOptions){
  var options = $.extend({
    onClose:function(){}
  }, customOptions);
  return this.each(function(i, ninjaWindow){
    var overlay = $('.ninjaWindowOverlay', ninjaWindow);
    var frame = $('.ninjaWindowFrame', ninjaWindow);
    $(frame).fadeOut(function() {
      $(overlay).fadeOut(function() {
        options.onClose.call();
        $(ninjaWindow).remove();
      });
    });
  });
};

$.fn.ninjaWindowRetitle = function(customOptions){
  var options = $.extend({
    icon:null,
    onRetitle:function(){},
    title:null
  }, customOptions);
  return this.each(function(i, ninjaWindow){
    $('.ninjaWindowTitle', ninjaWindow).attr('class', 'ninjaWindowTitle').ninjaIconCreate({icon:options.icon, title:options.title});
    options.onRetitle.call();
  });
};
