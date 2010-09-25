$.fn.ninjaButtonCreate = function(customOptions) {
  var options = $.extend({
    clicked:false,
    disabled:false,
    icon:null,
    onClick:function(){},
    title:null
  }, customOptions);
  return this.each(function(i, button){
    $(button).addClass('ninjaButton').append('<span class="ninjaButtonIcon"/>');
    if($(button).is('input')){
      if(options.title){
        $(button).val(options.title);
      };
      if($(button).is('input[type="submit"]')){
        $(button).addClass('ninjaButtonSubmittable');
      };
    }
    else{
      $('.ninjaButtonIcon', button).ninjaIconCreate({icon:options.icon, title:options.title});
    };
    if(options.clicked == true){
      $(button).addClass('ninjaButtonClicked');
    };
    if(options.submittable == true){
      $(button).addClass('ninjaButtonSubmittable');
    };
    if(options.disabled == true){
      $(button).addClass('ninjaButtonDisabled');
    }
    else{
      $(button).click(function(){
        $(button).toggleClass('ninjaButtonClicked');
        options.onClick.call(button);
      });
    };
  });
};

$.fn.ninjaButtonUnclick = function(){
  return this.each(function(i, button){
    $(button).removeClass('ninjaButtonClicked'); 
  });
};
