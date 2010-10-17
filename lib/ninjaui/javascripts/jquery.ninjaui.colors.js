$.ninjaColors = {
  background:{
    backgroundColor:'#fff',
    borderColor:'#ccc',
    color:'#333'
  },
  foreground:{
    backgroundColor:'#ccc',
    borderColor:'#999',
    color:'#000'
  },
  foregroundDisabled:{
    backgroundColor:'#ccc',
    borderColor:'#999',
    color:'#000'
  },
  foregroundSelected:{
    backgroundColor:'#c00',
    borderColor:'#900',
    color:'#fff'
  },
  foregroundSubmit:{
    backgroundColor:'#39c',
    borderColor:'#069',
    color:'#fff'
  },
  rating:{
    group:'#39c',
    single:'#c00',
    unselected:'#999'
  }
};

$.ninjaColorsGet = function(customColors){
  return $.extend({}, $.ninjaColors, customColors);
};

$.ninjaColorsSet = function(customColors){
  $.extend($.ninjaColors, customColors);
};

$.fn.ninjaLightness = function(){
  var color = this.css('background-color');
  if(color != '' && color != 'transparent' && color != 'rgba(0, 0, 0, 0)'){
    function lightness(colorRGB){
      return (299*colorRGB[0] + 587*colorRGB[1] + 114*colorRGB[2])/1000;
    };
    if(result = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(color)){
      return lightness([result[1], result[2], result[3]]); // rgb(#,#,#)
    }
    else if(result = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(color)){
      return lightness([parseFloat(result[1])*2.55, parseFloat(result[2])*2.55, parseFloat(result[3])*2.55]); // rgb(%,%,%)
    }
    else if(result = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(color)){
      return lightness([parseInt(result[1],16), parseInt(result[2],16), parseInt(result[3],16)]); // #a0b1c2
    }
    else if(result = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(color)){
      return lightness([parseInt(result[1]+result[1],16), parseInt(result[2]+result[2],16), parseInt(result[3]+result[3],16)]); // #fff
    }
    else{
      var colors = {
        aqua:[0,255,255],
        azure:[240,255,255],
        beige:[245,245,220],
        black:[0,0,0],
        blue:[0,0,255],
        brown:[165,42,42],
        cyan:[0,255,255],
        darkblue:[0,0,139],
        darkcyan:[0,139,139],
        darkgrey:[169,169,169],
        darkgreen:[0,100,0],
        darkkhaki:[189,183,107],
        darkmagenta:[139,0,139],
        darkolivegreen:[85,107,47],
        darkorange:[255,140,0],
        darkorchid:[153,50,204],
        darkred:[139,0,0],
        darksalmon:[233,150,122],
        darkviolet:[148,0,211],
        fuchsia:[255,0,255],
        gold:[255,215,0],
        green:[0,128,0],
        indigo:[75,0,130],
        khaki:[240,230,140],
        lightblue:[173,216,230],
        lightcyan:[224,255,255],
        lightgreen:[144,238,144],
        lightgrey:[211,211,211],
        lightpink:[255,182,193],
        lightyellow:[255,255,224],
        lime:[0,255,0],
        magenta:[255,0,255],
        maroon:[128,0,0],
        navy:[0,0,128],
        olive:[128,128,0],
        orange:[255,165,0],
        pink:[255,192,203],
        purple:[128,0,128],
        violet:[128,0,128],
        red:[255,0,0],
        silver:[192,192,192],
        white:[255,255,255],
        yellow:[255,255,0],
        transparent:[255,255,255]
      };
      return lightness(colors[jQuery.trim(color).toLowerCase()]); // named color
    };
  }
  else{
    this.parent().ninjaLightness();
  };
};