$.fn.ninjaButtonCreate = function(customOptions) {
  var options = $.extend({
    icon:null,
    onDeselect:function(){},
    onSelect:function(){},
    state:null,
    title:null
  }, customOptions);
  return this.each(function(i, button){
    $(button).addClass('ninjaButton').append('<span class="ninjaButtonIcon"/>');
    if($(button).is('input')){
      if(options.title){
        $(button).val(options.title);
      };
      if($(button).is('input[type="submit"]')){
        $(button).addClass('ninjaButtonSubmit');
      };
    }
    else{
      $('.ninjaButtonIcon', button).ninjaIconCreate({icon:options.icon, title:options.title});
    };
    if(options.state == 'disabled'){
      $(button).addClass('ninjaButtonDisabled');
    }
    else{
      if(options.state == 'selected'){
        $(button).addClass('ninjaButtonSelected');
      };
      $(button).click(function(){
        $(button).toggleClass('ninjaButtonSelected');
        if($(button).is('.ninjaButtonSelected')){
          options.onUnclick.call(button);
        }
        else{
          options.onClick.call(button);
        };
      });
    };
  });
};

$.fn.ninjaButtonDeselct = function(){
  return this.each(function(i, button){
    $(button).removeClass('ninjaButtonSelected'); 
  });
};
