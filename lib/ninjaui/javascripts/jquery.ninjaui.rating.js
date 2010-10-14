$.fn.ninjaRatingCreate = function(customOptions) {
  var options = $.extend({
    colors:$.ninjaColors,
    entity:'&#9733;',
    maximum:5,
    onChange:function(){},
    selectedGroup:0,
    selectedSingle:0
  }, customOptions);
  return this.each(function(i, rating){
    for(i=1; i <= options.maximum; i++){
      $(rating).append('<span class="ninjaRatingStar">' + options.entity + '</span>');
    };
    $(rating).addClass('ninjaRating').data({options:options}).ninjaRatingUpdate();
    $('.ninjaRatingStar', rating).each(function(i, star){
      if(navigator.userAgent.toLowerCase().match(/(iphone|ipod|ipad)/)){
        $(star).css('font-size', '18px');
      };
      $(star).mouseenter(function(){
        $(rating).ninjaRatingUpdate({selectedSingle:i + 1});
      }).mouseleave(function(){
        $(rating).ninjaRatingUpdate({selectedSingle:options.selectedSingle});
      }).click(function(){
        options.selectedSingle = i + 1;
        $(rating).data({options:options}).ninjaRatingUpdate();
        options.onChange.call({maximum:options.maximum, selected:options.selectedSingle});
      });
    });
  });
};

$.fn.ninjaRatingUpdate = function(customOptions) {
  return this.each(function(i, rating){
    var options = $.extend($(rating).data().options, customOptions);
    $('.ninjaRatingStar', rating).each(function(i, star){
      if(options.selectedSingle > i){
        $(star).css({color:options.colors.rating.single});
      }
      else if(options.selectedGroup > i){
        $(star).css({color:options.colors.rating.group});
      }
      else{
        $(star).css({color:options.colors.rating.unselected});
      };
    });
  });
};
