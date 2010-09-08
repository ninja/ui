$.extend($.ninjaui, {
  windowClose:function(customOptions){
    var options = $.extend({
      frame:null,
      onClose:function(){},
      overlay:null
    }, customOptions);
    $(options.frame).fadeOut(function() {
      $(options.overlay).fadeOut(function() {
        options.onClose.call();
        $(options.frame).remove();
        $(options.overlay).remove();
      });
    });
  },
  windowOpen:function(customOptions){
    var options = $.extend({
      onClose:function(){},
      onOpen:function(){},
      title:null,
      url:null
    }, customOptions);
    $(document.body).append('<div class="ninjauiWindowOverlay"/><div class="ninjauiWindowFrame"/>');
    var overlay = $('.ninjauiWindowOverlay').css({filter:'alpha(opacity = 0)', opacity:0});
    var frame = $('.ninjauiWindowFrame').append('<div class="ninjauiWindowHandle"/><div class="ninjauiWindowContent"/><div class="ninjauiWindowReflection"/>');
    var handle = $('.ninjauiWindowHandle', frame).append('<span class="ninjauiWindowTitle"/><span class="ninjauiWindowClose"/>');
    var title = $('.ninjauiWindowTitle', handle).ninjaui.iconCreate({icon:options.icon, title:options.title});
    var button = $('.ninjauiWindowClose', handle).ninjaui.buttonCreate({icon:'close', onClick:function(){
      $.ninjaui.windowClose({frame:$(frame), onClose:options.onClose, overlay:$(overlay)});
    }});
    var content = $('.ninjauiWindowContent', frame);
    $(window).keyup(function(event) {
      if (event.keyCode == 27) { // esc key
        $.ninjaui.windowClose({frame:$(frame), onClose:options.onClose, overlay:$(overlay)});
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
    });
    return true;
  },
  windowRetitle: function(customOptions){
    var options = $.extend({
      onRetitle:function(){},
      title:null
    }, customOptions);
    var title = $('.ninjauiWindowTitle');
    $(title).text(options.title, function() {
      options.onRetitle.call();
    });
  }
});
