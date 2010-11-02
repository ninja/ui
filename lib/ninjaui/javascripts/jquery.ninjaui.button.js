$.fn.ninjaButtonCreate = function(customOptions){
  var options = $.extend({
    colors:$.ninjaColorsGet(),
    icon:null,
    onDeselect:function(){},
    onSelect:function(){},
    radius:$.ninjaRadius,
    size:null,
    state:null,
    title:null
  }, customOptions);
  return this.each(function(i, button){
    $(button).data({options:options});
    $(button).addClass('ninjaPlastic').ninjaRadius({radius:options.radius});
    if(options.size){
      $button.css({fontSize:options.size});
    }
    if($(button).is('input')){
      if(options.title){
        $(button).val(options.title);
      }
    }
    else{
      if(options.title){
        $(button).text(options.title);
      }
      if(options.icon){
        if(options.title){
          $(button).prepend('&#160;');
        }
        $(button).prepend('<span/>');
        $('span', button).ninjaIconCreate(options.icon).css({height:$(button).height(), position:'relative', top:'-2px'});
      }
    }
    if(options.state == 'disabled'){
      $(button).ninjaButtonDisable();
    }
    else{
      $(button).ninjaButtonEnable();
    }
  });
};

$.fn.ninjaButtonDeselect = function(){
  return this.each(function(i, button){
    var options = $(button).data().options;
    $(button).removeClass('ninjaSelected'); 
    if($(button).attr('type') == 'submit'){
      $(button).css(options.colors.foregroundSubmit);
    }
    else{
      $(button).css(options.colors.foreground);
    }
    $('.ninjaIcon', button).ninjaIconLightness();
    options.onDeselect.call(button);
  });
};

$.fn.ninjaButtonDisable = function(){
  return this.each(function(i, button){
    var options = $(button).data().options;
    $(button).animate({opacity:0.5}).removeClass('ninjaEnabled').css(options.colors.foregroundDisabled);
    if($(button).is('input')){
      $(button).attr('disabled', 'disabled');
    }
    $(button).unbind('click');
  });
};

$.fn.ninjaButtonEnable = function(){
  return this.each(function(i, button){
    var options = $(button).data().options;
    $(button).animate({opacity:1}).addClass('ninjaEnabled');
    if($(button).is('input')){
      $(button).removeAttr('disabled');
    }
    if(options.state == 'selected' || $(button).hasClass('ninjaSelected')){
      $(button).addClass('ninjaSelected').css(options.colors.foregroundSelected);
    }
    else if($(button).is('input') && $(button).attr('type') == 'submit'){
      $(button).css(options.colors.foregroundSubmit);
    }
    else{
      $(button).css(options.colors.foreground);
    }
    $('.ninjaIcon', button).ninjaIconLightness();
    $(button).click(function(){
      if($(button).hasClass('ninjaSelected')){
        $(button).ninjaButtonDeselect(options);
      }
      else{
        $(button).ninjaButtonSelect(options);
      }
    });
  });
};

$.fn.ninjaButtonSelect = function(){
  return this.each(function(i, button){
    var options = $(button).data().options;
    $(button).addClass('ninjaSelected').css(options.colors.foregroundSelected);
    $('.ninjaIcon', button).ninjaIconLightness();
    options.onSelect.call(button);
  });
};
