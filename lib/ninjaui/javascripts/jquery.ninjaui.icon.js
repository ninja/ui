$.fn.ninjaIconAnimate = function(customOptions){
  var options = $.extend({
    frames:0,
    frameCurrent:1,
    speed:100
  }, customOptions);
  return this.each(function(i, icon){
    function scroll(){
      if(options.frameCurrent == options.frames){
        options.frameCurrent = 0;
      }
      $(icon).css('backgroundPosition', (options.frameCurrent * -16) + 'px center');
      options.frameCurrent ++;
    };
    setInterval(function(){
      scroll();
    }, options.speed);
  });
};

$.fn.ninjaIconCreate = function(name){
  if(!name){
    var name = 'add';
  };
  return this.each(function(i, icon){
    $(icon).addClass('ninjaIcon' + ' ninjaIcon-' + name.toLowerCase()).ninjaIconLightness();
  });
};

$.fn.ninjaIconLightness = function(){
  return this.each(function(i, icon){
    if($(icon).parent().ninjaLightness() < 125){
      $(icon).addClass('ninjaIconWhite').removeClass('ninjaIconBlack');
    }
    else{
      $(icon).addClass('ninjaIconBlack').removeClass('ninjaIconWhite');
    };
  });
};
