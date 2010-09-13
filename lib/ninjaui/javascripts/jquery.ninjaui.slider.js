$.fn.ninjaSliderCreate = function(customOptions){
  var options = $.extend({
    onStop:function(){},
    selected:0,
    values:[0,1,2,3,4,5,6,7,8,9,10],
    title:null,
    width:100
  }, customOptions);
  return this.each(function(i, slider){
    var id = $(slider).attr('id');
    if(options.title){
      $(slider).append('<label for="' + id + '">' + options.title + '</label>');
    };
    $(slider).addClass('ninjaSlider');
    if(navigator.userAgent.toLowerCase().match(/(iphone|ipod|ipad)/)){
      $(slider).append('<select name="' + id + '"/>');
      var select = $('select', slider);
      options.values.each(function(i, value){
        $(select).append('<option value="' + i + '">' + value + '</option>');
      });
      $(select).width(options.width + 'px').change(function(){
        options.onStop.call($(':selected', slider));
      });
    }
    else {
      var slots = options.values.length;
      var increment = Math.round(options.width / slots);
      var slot = $.inArray(options.selected, options.values);
      $(slider).append('<input type="hidden"/><span class="ninjaSliderTrack"><span class="ninjaSliderLevel"/><span class="ninjaSliderButton"/></span><span class="ninjaSliderText"/>');
      var button = $('.ninjaSliderButton', slider);
      var buttonWidth = $(button).outerWidth();
      var trackWidth = (increment * (slots - 1)) + buttonWidth + 'px';
      var track = $('.ninjaSliderTrack', slider).width(trackWidth);
      var selected = options.selected;
      var text = $('.ninjaSliderText', slider).width(trackWidth).text(selected);
      var levelWidth = function(slot, increment){
        return (slot * increment) + (buttonWidth / 2) + 'px';
      };
      var level = $('.ninjaSliderLevel', track).width(levelWidth(slot, increment));
      var input = $('input', slider).attr('name', id);
      $(button).css('left', (slot * increment) + 'px').draggable({
        addClasses:false,
        axis:'x',
        containment:slider,
        drag:function() {
          slot = $(button).position().left/increment;
          selected = options.values[slot];
          $(level).width(levelWidth(slot, increment));
          $(text).text(selected);
        },
        distance:increment,
        grid:[increment, 0],
        scroll:false,
        stop:function() {
          $(input).val(selected);
          options.onStop.call({selected:selected});
        }
      });
    };
  });
};
