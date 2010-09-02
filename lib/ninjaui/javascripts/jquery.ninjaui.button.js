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
      $(target).wrapInner('<span/>');
      $(target).text(options.title || '');
      if(options.icon) {
        $(target).attr('class', 'ninjauiIcon ninjauiIcon-' + options.icon.toLowerCase());
      }
      $(target).wrap('<span/>');
      button = $(target).parent();
      $(button).addClass(targetClass).addClass('ninjauiButton');
      if(options.clicked == true){
        $(button).addClass('ninjauiClicked');
      }
      if(options.submittable == true){
        $(button).addClass('ninjauiSubmittable');
      }
      if(options.disabled == true){
        $(button).addClass('ninjauiDisabled');
      }
      else{
        $(button).click(function(){
          $(button).toggleClass('ninjauiClicked');
          options.onClick.call(button);
        });
      }
    });
    return $(button);
  }
});
