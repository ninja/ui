$.fn.ninjaRatingCreate = function(customOptions) {
  var options = $.extend({
    entity:'&#9733;',
    group:0,
    maximum:5,
    onChange:function(){},
    single:0
  }, customOptions);
  return this.each(function(i, rating){
    for(i=1; i <= options.maximum; i++){
      $(rating).append('<span class="ninjaRatingStar">' + options.entity + '</span>');
    };
    $(rating).addClass('ninjaRating').ninjaRatingUpdate({group:options.group, single:options.single});
    $('.ninjaRatingStar', rating).each(function(i, star){
      $(star).hover(function(){
        $(rating).ninjaRatingUpdate({group:options.group, single:i + 1});
      }, function(){
        $(rating).ninjaRatingUpdate({group:options.group, single:options.single});
      }).click(function(){
        options.single = i + 1;
        $(rating).ninjaRatingUpdate({group:options.group, single:options.single});
        options.onChange.call({maximum:options.maximum, single:options.single});
      });
    });
  });
};

$.fn.ninjaRatingUpdate = function(customOptions) {
  var options = $.extend({
    group:0,
    single:0
  }, customOptions);
  return this.each(function(i, rating){
    $('.ninjaRatingStar', rating).each(function(i, star){
      if(options.single > i){
        $(star).removeClass('ninjaRatingStarGroup').addClass('ninjaRatingStarSingle');
      }
      else if(options.group > i){
        $(star).removeClass('ninjaRatingStarSingle').addClass('ninjaRatingStarGroup');
      }
      else{
        $(star).removeClass('ninjaRatingStarGroup').removeClass('ninjaRatingStarSingle');
      };
    });
  });
};
