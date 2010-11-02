$.ninjaRadius = '0.5em';

$.fn.ninjaRadius = function(customOptions){
  var options = $.extend({
    corners:null,
    radius:$.ninjaRadius
  }, customOptions);
  var radii;
  if(options.corners == 'bottom'){
    radii = [0,0,options.radius,options.radius];
  }
  else if(options.corners == 'bottomLeft'){
    radii = [0,0,0,options.radius];
  }
  else if(options.corners == 'bottomRight'){
    radii = [0,0,options.radius,0];
  }
  else if(options.corners == 'left'){
    radii = [options.radius,0,0,options.radius];
  }
  else if(options.corners == 'right'){
    radii = [0,options.radius,options.radius,0];
  }
  else if(options.corners == 'top'){
    radii = [options.radius,options.radius,0,0];
  }
  else if(options.corners == 'topLeft'){
    radii = [options.radius,0,0,0];
  }
  else if(options.corners == 'topRight'){
    radii = [0,options.radius,0,0];
  }
  else{
    radii = [options.radius,options.radius,options.radius,options.radius];
  }
  return this.each(function(i, selector){
    if(document.body.style.borderRadius !== undefined){
      if(radii[0] == radii[1] && radii[0] == radii[2] && radii[0] == radii[3]){
        $(selector).css({
          'border-radius':radii[0]
        });      
      }
      else{
        $(selector).css({
          'border-radius':radii[0] + ' ' + radii[1] + ' ' + radii[2] + ' ' + radii[3]
        });
      }
    }
    else if(document.body.style.WebkitBorderRadius !== undefined){
      $(selector).css({
        '-webkit-border-top-left-radius':radii[0],
        '-webkit-border-top-right-radius':radii[1],
        '-webkit-border-bottom-right-radius':radii[2],
        '-webkit-border-bottom-left-radius':radii[3]
      });
    }
    else if(document.body.style.MozBorderRadius !== undefined){
      $(selector).css({
        '-moz-border-radius-topleft':radii[0],
        '-moz-border-radius-topright':radii[1],
        '-moz-border-radius-bottomright':radii[2],
        '-moz-border-radius-bottomleft':radii[3]
      });
    }
    else if(document.body.style.KhtmlBorderRadius !== undefined){
      $(selector).css({
        '-khtml-border-top-left-radius':radii[0],
        '-khtml-border-top-right-radius':radii[1],
        '-khtml-border-bottom-right-radius':radii[2],
        '-khtml-border-bottom-left-radius':radii[3]
      });
    }
  });
};
