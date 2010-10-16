$.ninjaRadius = '0.5em';

$.fn.ninjaRadius = function(customOptions){
  var options = $.extend({
    corners:null,
    radius:$.ninjaRadius,
    radii:[$.ninjaRadius,$.ninjaRadius,$.ninjaRadius,$.ninjaRadius]
  }, customOptions);
  if(options.corners == 'bottom'){
    options.radii = [0,0,options.radius,options.radius];
  }
  else if(options.corners == 'bottomLeft'){
    options.radii = [0,0,0,options.radius];
  }
  else if(options.corners == 'bottomRight'){
    options.radii = [0,0,options.radius,0];
  }
  else if(options.corners == 'left'){
    options.radii = [options.radius,0,0,options.radius];
  }
  else if(options.corners == 'right'){
    options.radii = [0,options.radius,options.radius,0];
  }
  else if(options.corners == 'top'){
    options.radii = [options.radius,options.radius,0,0];
  }
  else if(options.corners == 'topLeft'){
    options.radii = [options.radius,0,0,0];
  }
  else if(options.corners == 'topRight'){
    options.radii = [0,options.radius,0,0];
  };
  return this.each(function(i, selector){
    if(document.body.style.borderRadius !== undefined){
      if(options.radii[0] == options.radii[1] && options.radii[0] == options.radii[2] && options.radii[0] == options.radii[3]){
        $(selector).css({
          'border-radius':options.radii[0]
        });      
      }
      else{
        $(selector).css({
          'border-radius':options.radii[0] + ' ' + options.radii[1] + ' ' + options.radii[2] + ' ' + options.radii[3]
        });
      };
    }
    else if(document.body.style.WebkitBorderRadius !== undefined){
      $(selector).css({
        '-webkit-border-top-left-radius':options.radii[0],
        '-webkit-border-top-right-radius':options.radii[1],
        '-webkit-border-bottom-right-radius':options.radii[2],
        '-webkit-border-bottom-left-radius':options.radii[3]
      });
    }
    else if(document.body.style.MozBorderRadius !== undefined){
      $(selector).css({
        '-moz-border-radius-topleft':options.radii[0],
        '-moz-border-radius-topright':options.radii[1],
        '-moz-border-radius-bottomright':options.radii[2],
        '-moz-border-radius-bottomleft':options.radii[3]
      });
    }
    else if(document.body.style.KhtmlBorderRadius !== undefined){
      $(selector).css({
        '-khtml-border-top-left-radius':options.radii[0],
        '-khtml-border-top-right-radius':options.radii[1],
        '-khtml-border-bottom-right-radius':options.radii[2],
        '-khtml-border-bottom-left-radius':options.radii[3]
      });
    };
  });
};
