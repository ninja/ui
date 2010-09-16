$.fn.ninjaSliderCreate = function(customOptions){
  var options = $.extend({
    onStop:function(){},
    names:null,
    selected:null,
    values:null,
    title:null,
    width:100
  }, customOptions);
  return this.each(function(i, slider){
    var id = $(slider).attr('id');
    if(options.title){
      $(slider).append('<label class="ninjaSliderTitle" for="' + id + '">' + options.title + '</label>');
    };
    $(slider).addClass('ninjaSlider');
    if(navigator.userAgent.toLowerCase().match(/(iphone|ipod|ipad)/)){
      $(slider).append('<select name="' + id + '"/>');
      var select = $('select', slider);
      $.each(options.values, function(i, value){
        $(select).append('<option value="' + value + '">' + (options.names[i] || value) + '</option>');
      });
      $(select).width(options.width + 'px').change(function(){
        var selected = $(':selected', select);
        options.onStop.call({selectedName:$(selected).text(), selectedValue:$(selected).attr('value')});
      });
    }
    else {
      var selectedValue = options.selected || options.values[0];
      var slots = options.values.length;
      var increment = Math.round(options.width / slots);
      var slot = $.inArray(selectedValue, options.values);
      var selectedName = options.names[slot] || selectedValue;
      $(slider).append('<input type="hidden"/><span class="ninjaSliderTrack"><span class="ninjaSliderLevel"/><span class="ninjaSliderButton"/></span><span class="ninjaSliderText"/>');
      var button = $('.ninjaSliderButton', slider);
      var buttonWidth = $(button).outerWidth();
      var trackWidth = (increment * (slots - 1)) + buttonWidth + 'px';
      var track = $('.ninjaSliderTrack', slider).width(trackWidth);
      var text = $('.ninjaSliderText', slider).width(trackWidth).text(selectedName);
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
          selectedValue = options.values[slot];
          selectedName = options.names[slot] || selectedValue;
          $(level).width(levelWidth(slot, increment));
          $(text).text(selectedName);
        },
        distance:increment,
        grid:[increment, 0],
        scroll:false,
        stop:function() {
          $(input).val(selectedValue);
          options.onStop.call({selectedName:selectedName, selectedValue:selectedValue});
        }
      });
    };
  });
};
