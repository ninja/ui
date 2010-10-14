$.fn.ninjaFilmstripCreate = function(customOptions) {
  var options = $.extend({
    colors:$.ninjaColors,
    frameHeight:100,
    frameWidth:100,
    icon:null,
    onBack:function(){},
    onForward:function(){},
    radius:$.ninjaRadius.half,
    seconds:0,
    show:3,
    title:null
  }, customOptions);
  var reel = this.each(function (i, frame) {
    $(frame).addClass('ninjaFilmstripFrame').css({borderColor:options.colors.background['borderColor'], height:options.frameHeight, width:options.frameWidth});
  }).wrapAll('<span class="ninjaFilmstripReel"/>').parent();
  var view = $(reel).wrap('<span class="ninjaFilmstripView"/>').parent().css(options.colors.background);
  var filmstrip = $(view).wrap('<div class="ninjaFilmstrip"/>').parent();
  var bar = $(filmstrip).prepend('<div class="ninjaFilmstripBar"/>').find('.ninjaFilmstripBar').css(options.colors.foreground).ninjaRadius({corners:'top', radius:options.radius});
  if(options.title){
    $(bar).text(options.title);
  }
  if(options.icon){
    if(options.title){
      $(bar).prepend('&#160;');
    };
    $(bar).prepend('<span class="ninjaFilmstripIcon"/>');
    $('.ninjaFilmstripIcon', bar).ninjaIconCreate(options.icon).css({height:$(button).height(), position:'relative', top:'-2px'});
  };
  var back = $(bar).prepend('<span class="ninjaFilmstripBack"/>').find('.ninjaFilmstripBack').ninjaButtonCreate({icon:'left'}).ninjaRadius({corners:'topLeft', radius:options.radius});
  var forward = $(bar).append('<span class="ninjaFilmstripForward"/>').find('.ninjaFilmstripForward').ninjaButtonCreate({icon:'right'}).ninjaRadius({corners:'topRight', radius:options.radius});
  frameOuterHeight = options.frameHeight + 10;
  frameOuterWidth = options.frameWidth + 11;
  $(reel).height(frameOuterHeight + 'px');
  $(view).height(frameOuterHeight + 'px').width((frameOuterWidth * options.show) - 1 + 'px');
  var pages = Math.ceil(this.length / options.show);
  var currentPage = 1;
  $(bar).width((frameOuterWidth * options.show) - 1 + 'px');
  $(back).click(function(){
    if(currentPage == 1){
      $(reel).animate({left: '-=' + (frameOuterWidth * options.show * (pages -1))});
      currentPage = pages;
    }
    else {
      $(reel).animate({left: '+=' + (frameOuterWidth * options.show)});
      --currentPage;
    }
    options.onBack.call();
    $(back).ninjaButtonDeselect();
  });
  $(forward).click(function(){
    if(currentPage == pages){
      $(reel).animate({left:0});
      currentPage = 1;
    }
    else{
      $(reel).animate({left: '-=' + (frameOuterWidth * options.show)});
      ++currentPage;
    }
    options.onForward.call();
    $(forward).ninjaButtonDeselect();
  });
  if(options.seconds > 0) {
    var milliseconds = options.seconds * 1000;
    var page = 0;
    (function advance() {
      setTimeout(function() {
        if (page++ < pages) {
          $(forward).click();
          advance();
        }
      }, milliseconds);
    })();
  }
  return this;
};
