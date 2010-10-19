$.ninjaWindowOpen = function(customOptions){
  var options = $.extend({
    colors:$.ninjaColorsGet(),
    icon:null,
    id:null,
    onClose:function(){},
    onOpen:function(){},
    radius:$.ninjaRadius,
    title:null,
    url:null,
    width:null
  }, customOptions);
  $(document.body).append('<div class="ninjaWindowOverlay"/><div class="ninjaWindowFrame"/>');
  var overlay = $('.ninjaWindowOverlay').css({opacity:0}).css(options.colors.background);
  var frame = $('.ninjaWindowFrame').attr('id', options.id).append('<div class="ninjaWindowHandle"/><div class="ninjaWindowContent"/><div class="ninjaWindowReflection"/>').data({options:options});
  if(options.width){
    $(frame).css({minWidth:options.width});
  }
  var handle = $('.ninjaWindowHandle', frame).css(options.colors.foreground).ninjaRadius({corners:'top', radius:options.radius});
  if(options.title){
    $(handle).text(options.title);
  };
  if(options.icon){
    if(options.title){
      $(handle).prepend('&#160;');
    };
    $(handle).prepend('<span class="ninjaWindowIcon"/>');
    $('.ninjaWindowIcon', handle).ninjaIconCreate(options.icon).css({height:$(handle).height(), position:'relative', top:'-2px'});
  };
  $(handle).append('<span class="ninjaWindowClose"/>');
  $('.ninjaWindowClose', handle).ninjaButtonCreate({icon:'remove', onSelect:function(){
    $(frame).ninjaWindowClose();
  }}).ninjaRadius({corners:'topRight', radius:options.radius});
  var content = $('.ninjaWindowContent', frame).css(options.colors.background).ninjaRadius({corners:'bottom', radius:options.radius});
  if($(content).ninjaLightness() < 125){
    $(overlay).css({backgroundColor:'#fff'});
  }
  else{
    $(overlay).css({backgroundColor:'#000'});
  };
  $(document).keyup(function(event){
    if (event.keyCode == 27) { // esc key
      $(frame).ninjaWindowClose();
      $(document).unbind('keyup');
    }
  });
  $(frame).click(function(event){
    event.stopPropagation();
  }).draggable({
    containment:'document',
    cursor:'pointer',
    handle:$(handle)
  });
  $(content).load(options.url, function() {
    $(overlay).css({
      height:$(document).height(),
      width:$(window).width()
    }).animate({opacity:0.5}, function(){
      var frameWidth = $(frame).width();
      $(handle).innerWidth(frameWidth);
      $(content).innerWidth(frameWidth);
      $(frame).position({
        at:'center top',
        collision:'fit fit',
        of:window,
        offset:'0 20',
        my:'center top'
      }).fadeIn(function(){
        options.onOpen.call(content);
      });
    });
    $('.ninjaWindowReflection').css(options.colors.background).ninjaRadius({radius:options.radius}).position({
      at:'left bottom',
      of:frame,
      my:'left top'
    }).css({opacity:0.125});
  });
  return frame;
};

$.fn.ninjaWindowClose = function(){
  return this.each(function(i, frame){
    var options = $(frame).data().options;
    var overlay = $(frame).prev('.ninjaWindowOverlay');
    $(frame).fadeOut(function() {
      $(overlay).fadeOut(function() {
        options.onClose.call();
        $(frame).remove();
        $(overlay).remove();
      });
    });
  });
};

$.fn.ninjaWindowRetitle = function(customOptions){
  return this.each(function(i, frame){
    var options = $.extend($(frame).data().options, {onRetitle:function(){}}, customOptions);
    $('.ninjaWindowHandle', frame).text(options.title);
    $('.ninjaWindowIcon', frame).attr({'class':''}).ninjaIconCreate(options.icon);
    options.onRetitle.call();
  });
};
