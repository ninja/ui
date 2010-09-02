$.extend($.ninjaui, {
  waitStart: function(customOptions){
    var options = $.extend({
      message:'Updating...',
      onStop:function(){},
      seconds:0
    }, customOptions);
    $(document.body).append('<div class="ninjauiWait">' +
      '<div class="ninjauiWaitFrame">' +
        options.message + '<div class="ninjauiWaitReflection"></div>' +
      '</div>' +
    '</div>');
    var overlay = $('.ninjauiWait');
    var frame = $('.ninjauiWaitFrame', overlay);
    $(overlay).fadeIn(function() {
      $(overlay).css('filter', 'progid:DXImageTransform.Microsoft.Gradient(StartColorStr=#80ffffff, EndColorStr=#80ffffff)');
      $(frame).position({
        at:'center',
        collision:'fit',
        of:$(overlay),
        my:'center'
      });
      $(frame).fadeIn(function() {
        $(frame).css('filter', 'progid:DXImageTransform.Microsoft.Gradient(StartColorStr=#c0000000, EndColorStr=#c0000000)');
        if(options.seconds > 0) {
          var milliseconds = options.seconds * 1000;
          setTimeout(function() {
            $.ninjaui.waitStop({onStop:options.onStop});
          }, milliseconds);
        }
      });
    });
  },
  waitStop: function(customOptions){
    var options = $.extend({
      onStop:function(){}
    }, customOptions);
    var overlay = $('.ninjauiWait');
    var frame = $('.ninjauiWaitFrame', overlay);
    $(frame).fadeOut(function() {
      $(overlay).fadeOut(function() {
        $(overlay).remove();
        options.onStop.call();
      });
    });
  }
});
