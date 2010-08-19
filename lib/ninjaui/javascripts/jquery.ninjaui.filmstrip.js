$.fn.nuiFilmstrip = function(customOptions) {
  var options = $.extend({
    frameHeight:100,
    frameWidth:100,
    seconds:0,
    show:3,
    title:''
  }, customOptions);
  return this.each(function (i, filmstrip) {
    $(filmstrip).addClass('nui-filmstrip');
    var frameArray = $(filmstrip).find('> span');
    $(frameArray).wrapAll('<span class="nui-view"><span class="nui-reel"/></span>').each(function (i, frame) {
      $(frame).addClass('nui-frame').css({height:options.frameHeight,width:options.frameWidth});
    });
    var view = $(filmstrip).find('> .nui-view');
    var reel = $(view).find('> .nui-reel');
    var frameOuterHeight = options.frameHeight + 10;
    var frameOuterWidth = options.frameWidth + 11;
    $(reel).height(frameOuterHeight + 'px');
    $(view).height(frameOuterHeight + 'px').width((frameOuterWidth * options.show) - 1 + 'px');
    var pages = Math.ceil($(frameArray).length / options.show);
    var currentPage = 1;
    $(filmstrip).prepend('<div class="nui-bar"><button class="nui-button back"><span class="nui-icon nui-icon-left"></span></button>' + options.title + '<button class="nui-button forward"><span class="nui-icon nui-icon-right"></span></button></div>');
    var bar = $(filmstrip).find('> .nui-bar');
    $(bar).width((frameOuterWidth * options.show) - 1 + 'px');
    $('button.back', filmstrip).click(function () {
      if(currentPage == 1){
        $(reel).animate({left: '-=' + (frameOuterWidth * options.show * (pages -1))});
        currentPage = pages;
      }
      else {
        $(reel).animate({left: '+=' + (frameOuterWidth * options.show)});
        --currentPage;
      }
    });
    $('button.forward', filmstrip).click(function () {
      if(currentPage == pages){
        $(reel).animate({left:0});
        currentPage = 1;
      }
      else{
        $(reel).animate({left: '-=' + (frameOuterWidth * options.show)});
        ++currentPage;
      }
    });
    if(options.seconds > 0) {
      var milliseconds = options.seconds * 1000;
      var page = 0;
      (function advance() {
        setTimeout(function() {
          if (page++ < pages) {
            $('button.forward', filmstrip).click();
            advance();
          }
        }, milliseconds);
      })();
    }
  });
};
