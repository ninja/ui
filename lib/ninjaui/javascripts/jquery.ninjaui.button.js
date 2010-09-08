$.extend($.fn.ninjaui, {
  buttonCreate:function(customOptions) {
    var config = getConfig();
    var options = $.extend({
      clicked:false,
      disabled:false,
      icon:null,
      onClick:function(){},
      title:null
    }, customOptions);
    var button;
    global.selected.each(function(i, target) {
      var targetClass = $(target).attr('class');
      $(target).ninjaui.iconCreate({icon:options.icon, title:options.title});
      $(target).wrap('<span/>');
      button = $(target).parent();
      $(button).addClass(targetClass).addClass('ninjauiButton');
      if(options.clicked == true){
        $(button).addClass('ninjauiButtonClicked');
      }
      if(options.submittable == true){
        $(button).addClass('ninjauiButtonSubmittable');
      }
      if(options.disabled == true){
        $(button).addClass('ninjauiButtonDisabled');
      }
      else{
        $(button).click(function(){
          $(button).toggleClass('ninjauiButtonClicked');
          options.onClick.call(button);
          $(button).removeClass('ninjauiButtonClicked');
        });
      }
    });
    return $(button);
  }
});
