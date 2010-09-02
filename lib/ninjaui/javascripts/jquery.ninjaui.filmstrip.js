$.extend($.fn.ninjaui, {
  filmstripCreate:function(customOptions) {
    var config = getConfig();
    var options = $.extend({
      frameHeight:100,
      frameWidth:100,
      icon:null,
      onBack:function(){},
      onForward:function(){},
      seconds:0,
      show:3,
      title:null
    }, customOptions);
    var reel = $(global.selected).wrapAll('<span/>').parent();
    var wrapper;
    global.selected.each(function (i, filmstrip) {
      var frames = $(filmstrip).children('span').each(function (i, frame) {
        $(frame).addClass('ninjauiFilmstripFrame').css({height:options.frameHeight, width:options.frameWidth});
      });
      var view = $(reel).addClass('ninjauiFilmstripReel').wrap('<span/>').parent();
      var wrapper = $(view).addClass('ninjauiFilmstripView').wrap('<div/>').parent();
      var bar = $(wrapper).addClass('ninjauiFilmstrip').prepend('<div/>').find('> div').text(options.title || '');
      var back = $(bar).addClass('ninjauiFilmstripBar').prepend('<span class="ninjauiFilmstripBack"/>').find('> .ninjauiFilmstripBack').ninjaui.buttonCreate({icon:'left'});
      var forward = $(bar).append('<span class="ninjauiFilmstripForward"/>').find('> .ninjauiFilmstripForward').ninjaui.buttonCreate({icon:'right'});
      frameOuterHeight = options.frameHeight + 10;
      frameOuterWidth = options.frameWidth + 11;
      $(reel).height(frameOuterHeight + 'px');
      $(view).height(frameOuterHeight + 'px').width((frameOuterWidth * options.show) - 1 + 'px');
      var pages = Math.ceil($(frames).length / options.show);
      var currentPage = 1;
      $(bar).width((frameOuterWidth * options.show) - 1 + 'px');
      $(back).click(function () {
        if(currentPage == 1){
          $(reel).animate({left: '-=' + (frameOuterWidth * options.show * (pages -1))});
          currentPage = pages;
        }
        else {
          $(reel).animate({left: '+=' + (frameOuterWidth * options.show)});
          --currentPage;
        }
        options.onBack.call(currentPage);
        $(back).removeClass('ninjauiClicked');
      });
      $(forward).click(function () {
        if(currentPage == pages){
          $(reel).animate({left:0});
          currentPage = 1;
        }
        else{
          $(reel).animate({left: '-=' + (frameOuterWidth * options.show)});
          ++currentPage;
        }
        options.onForward.call(currentPage);
        $(forward).removeClass('ninjauiClicked');
      });
      if(options.seconds > 0) {
        var milliseconds = options.seconds * 1000;
        var page = 0;
        (function advance() {
          setTimeout(function() {
            if (page++ < pages) {
              $.ninjaui.filmstripForward(options);
              advance();
            }
          }, milliseconds);
        })();
      }
    });
    return $(wrapper);
  }
});
