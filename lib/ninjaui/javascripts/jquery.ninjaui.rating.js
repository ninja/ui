$.fn.ninjaRatingCreate = function(customOptions) {
  var options = $.extend({
    entity:'&#9733;',
    group:0,
    single:0,
    onChange:function(){}
  }, customOptions);
  return this.each(function(i, div) {
    $(div).hide();
    var radioArray = $('input:radio', div);
    var title = $(div).attr('title');
    var titleHTML = '';
    if(title != '') {
      titleHTML = '<div class="nui-rating-label">' + title + '</div>';
    }
    $(div).after('<div class="nui nui-rating">' + titleHTML +
      '<div class="nui-rating-stars"></div>' +
    '</div>');
    var rating = $(div).next('.nui-rating');
    var stars = $('.nui-rating-stars', rating);
    $(radioArray).each(function(i, radio) {
      var active = '';
      if(options.single > i) {
        active = ' nui-rating-single';
      }
      else if(options.group > i) {
        active = ' nui-rating-group';
      }
      $(stars).append('<span class="nui-rating-star' + active + '" title ="' + $(radio).attr('title') + '"></span>');
    });
    var starChange = function(changedStarCount, starType) {
      $('.nui-rating-star', stars).each(function(i, star) {
        $(star).removeClass('nui-rating-single').removeClass('nui-rating-group');
        if(changedStarCount > i) {
          $(star).addClass('nui-rating-' + starType);
        }
      });
    };
    $('.nui-rating-star', stars).each(function(i, star) {
      $(star).hover(function() {
        starChange(i + 1, 'single');
      },
      function() {
        if(options.single > 0) {
          starChange(options.single, 'single');
        }
        else if(options.group > 0) {
          starChange(options.group, 'group');
        }
        else {
          starChange(0);
        }
      });
      $(star).click(function() {
        var starCurrent = $(radioArray)[i];
        $(starCurrent).attr('checked', 'checked');
        options.single = i + 1;
        starChange(options.single, 'single');
        options.onClick.call($(starCurrent));
      });
    });
  });
};
