$.fn.ninjaRatingCreate = function(customOptions) {
  var options = $.extend({
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
    $(rating).addClass('ninjaRating').ninjaRatingUpdate({selectedGroup:options.selectedGroup, selectedSingle:options.selectedSingle});
    $('.ninjaRatingStar', rating).each(function(i, star){
      $(star).hover(function(){
        $(rating).ninjaRatingUpdate({selectedGroup:options.selectedGroup, selectedSingle:i + 1});
      }, function(){
        $(rating).ninjaRatingUpdate({selectedGroup:options.selectedGroup, selectedSingle:options.selectedSingle});
      }).click(function(){
        options.selectedSingle = i + 1;
        $(rating).ninjaRatingUpdate({selectedGroup:options.selectedGroup, selectedSingle:options.selectedSingle});
        options.onChange.call({maximum:options.maximum, selected:options.selectedSingle});
      });
    });
  });
};

$.fn.ninjaRatingUpdate = function(customOptions) {
  var options = $.extend({
    selectedGroup:0,
    selectedSingle:0
  }, customOptions);
  return this.each(function(i, rating){
    $('.ninjaRatingStar', rating).each(function(i, star){
      if(options.selectedSingle > i){
        $(star).removeClass('ninjaRatingStarGroup').addClass('ninjaRatingStarSingle');
      }
      else if(options.selectedGroup > i){
        $(star).removeClass('ninjaRatingStarSingle').addClass('ninjaRatingStarGroup');
      }
      else{
        $(star).removeClass('ninjaRatingStarGroup').removeClass('ninjaRatingStarSingle');
      };
    });
  });
};
