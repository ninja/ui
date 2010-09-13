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
      var index = options.values.indexOf(options.selected);
      var levelWidth = function(index, increment){
        return (index * increment) + 9 + 'px';
      };
      var trackWidth = (increment * (slots - 1)) + 18 + 'px';
      $(slider).append('<input type="hidden"/><span class="ninjaSliderTrack"><span class="ninjaSliderLevel"/><span class="ninjaSliderButton"/></span><span class="ninjaSliderText"/>');
      var input = $('input', slider).attr('name', id);
      var track = $('.ninjaSliderTrack', slider).width(trackWidth);
      var selected = options.selected;
      var text = $('.ninjaSliderText', slider).width(trackWidth).text(selected);
      var level = $('.ninjaSliderLevel', track).width(levelWidth(index, increment));
      var button = $('.ninjaSliderButton', track).css('left', (index * increment) + 'px').draggable({
        addClasses:false,
        axis:'x',
        containment:slider,
        drag:function() {
          index = Math.round($(button).position().left/increment);
          selected = options.values[index];
          $(level).width(levelWidth(index, increment));
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
