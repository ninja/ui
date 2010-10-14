$.ninjaMessageOpen = function(customOptions){
  var options = $.extend({
    colors:$.ninjaColors,
    icon:null,
    id:null,
    onClose:function(){},
    onOpen:function(){},
    radius:$.ninjaRadius,
    seconds:0,
    text:null,
    title:null
  }, customOptions);
  var message = $(document.body).append('<div class="ninjaMessage"/>').children('.ninjaMessage').attr('id', options.id).css({opacity:0.75}).append('<div class="ninjaMessageHandle"/><div class="ninjaMessageContent"/><div class="ninjaMessageReflection"/>');
  var timer = null;
  if(options.seconds > 0){
    var milliseconds = options.seconds * 1000;
    timer = setTimeout(function(){
      $(message).ninjaMessageClose();
    }, milliseconds);
  };
  $(message).data({options:options});
  var handle = $('.ninjaMessageHandle', message).append('<span class="ninjaMessageClose"/>').css(options.colors.foreground);
  if(options.title){
    $(handle).text(options.title);
  };
  if(options.icon){
    if(options.title){
      $(handle).prepend('&#160;');
    };
    $(handle).prepend('<span class="ninjaMessageIcon"/>');
    $('.ninjaMessageIcon', handle).ninjaIconCreate(options.icon).css({height:$(handle).height(), position:'relative', top:'-2px'});
  };
  $('.ninjaMessageClose', handle).ninjaButtonCreate({icon:'remove', onSelect:function(){
    $(message).ninjaMessageClose(timer);
  }}).ninjaRadius({radius:'0'});
  var content = $('.ninjaMessageContent', message).text(options.text).css(options.colors.foreground).ninjaRadius({corners:'bottom', radius:options.radius});
  $('.ninjaMessageReflection').css(options.colors.foreground).ninjaRadius({radius:options.radius}).position({
    at:'left bottom',
    of:message,
    my:'left top'
  }).css({opacity:0.125});
  $(document).keyup(function(event){
    if (event.keyCode == 27) { // esc key
      $(message).ninjaMessageClose(timer);
      $(document).unbind('keyup');
    }
  });
  $(message).position({
    at:'top',
    collision:'fit none',
    of:window,
    my:'top'
  }).slideDown('slow');
};

$.fn.ninjaMessageClose = function(timer){
  return this.each(function(i, message){
    clearTimeout(timer);
    var options = $(message).data().options;
    $(message).slideUp('slow', function() {
      options.onClose.call();
      $(message).remove();
    });
  });
};
