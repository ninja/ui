$.fn.ninjaSliderCreate = function(customOptions) {
  var options = $.extend({
    onDrag:function(){},
    onStop:function(){},
    unit:20
  }, customOptions);
  return this.each(function(i, select) {
    var selectArray = $('option', select);
    var width = selectArray.length * options.unit;
    var touchDevice = navigator.userAgent.toLowerCase().match(/(iphone|ipod|ipad)/);
    $(select).wrap('<span class="nui-slider" id="nui-slider-' + $(select).attr('id') + '">' +
      '<span class="nui-label">' + $(select).attr('title') + '</span>' +
    '</span>');
    $(select).wrap('<span class="nui-bevel"/>');
    if(touchDevice) {
      $(select).css('width', width + 'px').show().change(function() {
        options.onStop.call($(':selected', select));
      });
    }
    else {
      $(select).hide();
      var index = $(':selected', select).index();
      var choice = $(selectArray)[index];
      var choiceText = $(choice).text();
      $(select).after('<span class="nui-track">' +
        '<span class="nui-level"></span>' +
        '<span class="nui-button"></span>' +
      '</span>' +
      '<span class="nui-text nui-ellipsis" title="' + choiceText + '">' + choiceText + '</span>');
      var slider = $(select).closest('.nui-slider');
      var bevel = $('.nui-bevel', slider);
      var track = $('.nui-track', slider);
      var level = $('.nui-level', slider);
      var button = $('.nui-button', slider);
      var text = $('.nui-text', slider);
      $(track).css('width', width + 'px');
      $(text).css('width', width + 'px');
      $(level).css('width', index * options.unit + 2 + 'px');
      $(button).css('left', index * options.unit + 'px').css('width', options.unit - 2);
      $(button).draggable({
        addClasses:false,
        axis:'x',
        containment:bevel,
        drag:function() {
          index = Math.round($(button).position().left/options.unit);
          $(level).css('width', index * options.unit + 2 + 'px');
          choice = $(selectArray)[index];
          choiceText = $(choice).text();
          $('.nui-text', bevel).remove();
          $(bevel).append('<div class="nui-text nui-ellipsis" title="' + choiceText + '">' + choiceText + '</div>');
          $('.nui-text', bevel).css('width', width + 'px');
          options.onDrag.call($(choice));
        },
        distance:options.unit,
        grid:[options.unit, 0],
        scroll:false,
        stop:function() {
          $(select).val($(choice).attr('value'));
          options.onStop.call($(choice));
        }
      });
    }
  });
};
