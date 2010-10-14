$.ninjaRadius = '0.5em';

$.fn.ninjaRadius = function(customOptions){
  var options = $.extend({
    radius:$.ninjaRadius
  }, customOptions);
  var value;
  if(options.corners == 'bottom'){
    value = '0 0 ' + options.radius + ' ' + options.radius;
  }
  else if(options.corners == 'bottomLeft'){
    value = '0 0 0 ' + options.radius;
  }
  else if(options.corners == 'bottomRight'){
    value = '0 0 ' + options.radius + ' 0';
  }
  else if(options.corners == 'left'){
    value = options.radius + ' 0 0 ' + options.radius;
  }
  else if(options.corners == 'right'){
    value = '0 ' + options.radius + ' ' + options.radius + ' 0';
  }
  else if(options.corners == 'top'){
    value = options.radius + ' ' + options.radius + ' 0 0';
  }
  else if(options.corners == 'topLeft'){
    value = options.radius + ' 0 0 0';
  }
  else if(options.corners == 'topRight'){
    value = '0 ' + options.radius + ' 0 0';
  }
  else{
    value = options.radius;
  }
  return this.each(function(i, selector){
    if(document.body.style.borderRadius !== undefined){
      $(selector).css({borderRadius:value});
    }
    else if(document.body.style.MozBorderRadius !== undefined){
      $(selector).css({'-moz-border-radius':value});
    }
    else if(document.body.style.MsBorderRadius !== undefined){
      $(selector).css({'-ms-border-radius':value}); 
    }
    else if(document.body.style.WebkitBorderRadius !== undefined){
      $(selector).css({'-webkit-border-radius':value});
    }
    else if(document.body.style.KhtmlBorderRadius !== undefined){
      $(selector).css({'-khtml-border-radius':value});
    };
  });
};
