$.fn.ninjaSliderCreate = function(customOptions){
  var options = $.extend({
    colors:$.ninjaColorsGet(),
    onStop:function(){},
    onUpdate:function(){},
    names:null,
    radius:$.ninjaRadius,
    selected:null,
    values:null,
    title:null,
    width:100
  }, customOptions);
  return this.each(function(i, slider){
    var id = $(slider).attr('id');
    if(options.title){
      $(slider).append('<div class="ninjaSliderTitle">' + options.title + '</div>');
    }
    $(slider).addClass('ninjaSlider').css(options.colors.background).ninjaRadius({radius:options.radius}).data({options:options});
    var selectedValue = options.selected || options.values[0];
    if(navigator.userAgent.toLowerCase().match(/(iphone|ipod|ipad)/)){
      $(slider).append('<select name="' + id + '"/>');
      var select = $('select', slider);
      $.each(options.values, function(i, value){
        $(select).append('<option value="' + value + '">' + (options.names[i] || value) + '</option>');
      });
      $(select).val(selectedValue).width(options.width + 'px').change(function(){
        var selected = $(':selected', select);
        options.onStop.call({selectedName:$(selected).text(), selectedValue:$(selected).attr('value')});
      });
    }
    else {
      var slots = options.values.length;
      var increment = Math.round(options.width / slots);
      var slot = $.inArray(selectedValue, options.values);
      var selectedName = options.names[slot] || selectedValue;
      $(slider).append('<input type="hidden"/><div class="ninjaSliderContainer"><div class="ninjaSliderTrack"><div class="ninjaSliderLevel"/></div><span class="ninjaPlastic ninjaEnabled ninjaSliderButton"/></div><div class="ninjaSliderText"/>');
      var button = $('.ninjaSliderButton', slider).css(options.colors.foreground).ninjaRadius({radius:'0.8em'});
      var buttonRadius = Math.round($(button).outerWidth() / 2);
      var trackWidth = increment * (slots - 1);
      var container = $('.ninjaSliderContainer', slider).width(trackWidth + (buttonRadius * 2) + 'px');
      var track = $('.ninjaSliderTrack', slider).width(trackWidth + 'px').position({
        at:'center center',
        collision:'none none',
        of:container,
        my:'center center'
      }).ninjaRadius({radius:'0.5em'}).css(options.colors.foreground);
      var text = $('.ninjaSliderText', slider).width(trackWidth + 'px').text(selectedName);
      var levelWidth = function(slot, increment){
        return slot * increment + 'px';
      };
      var level = $('.ninjaSliderLevel', track).ninjaRadius({radius:'0.35em'}).css(options.colors.foregroundSelected).width(levelWidth(slot, increment));
      var input = $('input', slider).attr('name', id);
      $(button).position({
        at:'left center',
        collision:'none none',
        of:container,
        offset:(slot * increment) + ' 0',
        my:'left center'
      }).draggable({
        addClasses:false,
        axis:'x',
        containment:container,
        drag:function() {
          slot = Math.round(($(button).position().left) / increment);
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
    }
  });
};

$.fn.ninjaSliderUpdate = function(customOptions){
  return this.each(function(i, slider){
    var options = $.extend($(slider).data().options, customOptions);
    var selectedValue = options.selected || options.values[0];
    var slots = options.values.length;
    var increment = Math.round(options.width / slots);
    var slot = $.inArray(selectedValue, options.values);
    var selectedName = options.names[slot] || selectedValue;
    options.onUpdate.call({selectedName:selectedName, selectedValue:selectedValue});
    if(navigator.userAgent.toLowerCase().match(/(iphone|ipod|ipad)/)){
      $('select', slider).val(selectedValue);
    }
    else {
      var container = $('.ninjaSliderContainer', slider);
      var button = $('.ninjaSliderButton', slider).position({
        at:'left center',
        collision:'none',
        of:container,
        offset:(slot * increment) + ' 0',
        my:'left'
      });
      $('.ninjaSliderLevel', slider).width(slot * increment + 'px');
      $('.ninjaSliderText', slider).text(selectedName);
    }
  });
};

