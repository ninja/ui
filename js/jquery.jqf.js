(function($) { // Begin jqFace

  $.jqf = { // Begin Functions
    drawerClose: function(drawer){
      var handle = $(drawer).prev('.jqf-drawer-handle');
      var icon = $('.jqf-icon', handle);
      $(drawer).slideUp(function() {
        $(handle).removeClass('jqf-active').toggleClass('jqf-last', $(drawer).is('.jqf-last'));
        $(icon).addClass('jqf-icon-right').removeClass('jqf-icon-down');
      });
    },
    drawerOpen: function(drawer){
      var handle = $(drawer).prev('.jqf-drawer-handle');
      var icon = $('.jqf-icon', handle);
      $(handle).addClass('jqf-active').removeClass('jqf-last');
      $(icon).addClass('jqf-icon-down').removeClass('jqf-icon-right');
      $(drawer).slideDown();
    },
    drawersClose: function(drawers){
      $.each(drawers, function(i, drawer) {
        $.jqf.drawerClose(drawer);
      });
    },
    drawersOpen: function(drawers){
      $.each(drawers, function(i, drawer) {
        $.jqf.drawerOpen(drawer);
      });
    },
    folderToggle: function(position, folders){
      var tabs = $('.jqf-folders-tabs', folders);
      $('.jqf-folder-tab', tabs).each(function(i, tab) {
        if(i == position) {
          $(tab).addClass('jqf-active');
        }
        else {
          $(tab).removeClass('jqf-active');
        }
      });
      $('.jqf-folder', folders).each(function(i, folder) {
        if(i == position) {
          $(folder).show();
        }
        else {
          $(folder).hide();
        }
      });
    },
    framePosition: function(customOptions){
      var options = $.extend({
        frame:$('.jqf-window-frame'),
        overlay:$(window)
      }, customOptions);
      var overlayMiddleHorizontal = parseInt($(options.overlay).width() / 2);
      if($(window).height() < $(options.overlay).height()) {
        var overlayMiddleVertical = parseInt(($(window).height() - $(options.overlay).offset().top) / 2);
      }
      else {
        var overlayMiddleVertical = parseInt($(options.overlay).height() / 2 + $(options.overlay).offset().top);
      }
      var frameMiddleHorizontal = parseInt($(options.frame).innerWidth() / 2);
      var frameMiddleVertical = parseInt($(options.frame).innerHeight() / 2);
      var left = overlayMiddleHorizontal - frameMiddleHorizontal;
      left = (left > 0) ? left : 0;
      var top = overlayMiddleVertical - frameMiddleVertical;
      top = (top > 0) ? top : 0;
      $(options.frame).css('left', left + 'px');
      $(options.frame).css('top', top + 'px');
    },
    waitStart: function(customOptions){
      var options = $.extend({
        content:'Updating...',
        object:$(document.body),
        onStop:function(){},
        seconds:0
      }, customOptions);
      $(options.object).css('position', 'relative').append('<div class="jqf jqf-wait">' +
        '<div class="jqf-wait-frame">' +
          options.content + '<div class="jqf-wait-reflection"></div>' +
        '</div>' +
      '</div>');
      var overlay = $('.jqf-wait', options.object);
      var frame = $('.jqf-wait-frame', overlay);
      $(overlay).fadeIn(function() {
        $(overlay).css('filter', 'progid:DXImageTransform.Microsoft.Gradient(StartColorStr=#80ffffff, EndColorStr=#80ffffff)');
        $.jqf.framePosition({frame:frame, overlay:overlay});
        $(frame).fadeIn(function() {
          $(frame).css('filter', 'progid:DXImageTransform.Microsoft.Gradient(StartColorStr=#c0000000, EndColorStr=#c0000000)');
          if(options.seconds > 0) {
            var milliseconds = options.seconds * 1000;
            setTimeout(function() {
              $.jqf.waitStop({
                object:$(options.object),
                onStop:options.onStop
              });
            }, milliseconds);
          }
        });
      });
    },
    waitStop: function(customOptions){
      var options = $.extend({
        object:$(document.body),
        onStop:function(){}
      }, customOptions);
      var overlay = $('.jqf-wait', options.object);
      var frame = $('.jqf-wait-frame', overlay);
      $(frame).fadeOut(function() {
        $(overlay).fadeOut(function() {
          options.onStop.call();
          $(overlay).remove();
        });
      });
    },
    windowClose: function(customOptions){
      var options = $.extend({
        onClose:function(){}
      }, customOptions);
      var overlay = $('.jqf-window');
      var frame = $('.jqf-window-frame');
      $(frame).fadeOut(function() {
        $(overlay).fadeOut(function() {
          options.onClose.call();
          $(frame).remove();
          $(overlay).remove();
        });
      });
    },
    windowOpen: function(customOptions){
      var options = $.extend({
        onClose:function(){},
        onOpen:function(){},
        title:'Untitled',
        url:''
      }, customOptions);
      $(document.body).append('<div class="jqf-window"></div>' +
        '<div class="jqf jqf-window-frame">' +
          '<div class="jqf-window-handle"><span class="jqf-window-title">' +
            options.title + '</span><span class="jqf-icon jqf-icon-close jqf-window-close"></span>' +
          '</div>' +
          '<div class="jqf-window-content"></div>' +
          '<div class="jqf-window-reflection"></div>' +
        '</div>').keyup(function(event) {
        if (event.keyCode == 27) { // esc key
          $.jqf.windowClose(options);
        }
      });
      var overlay = $('.jqf-window');
      $(window).resize(function() {
        $.jqf.framePosition({frame:$(frame), overlay:$(overlay)});
      });
      var frame = $('.jqf-window-frame');
      var handle = $('.jqf-window-handle', frame);
      $(frame).click(function(event) {
        event.stopPropagation();
      }).draggable({
        containment:$(overlay),
        cursor:'pointer',
        handle:$(handle)
      });
      var content = $('.jqf-window-content', frame);
      $(content).load(options.url, function() {
        $('.jqf-window-close', frame).click(function() {
          $.jqf.windowClose(options);
        });
        $(overlay).css('filter', 'alpha(opacity = 75)').fadeIn(function() {
          $.jqf.framePosition({frame:$(frame), overlay:$(overlay)});
          $(frame).fadeIn(function() {
            options.onOpen.call(content);
          });
        });
      });
    },
    windowRetitle: function(customOptions){
      var options = $.extend({
        onRetitle:function(){},
        title:'Untitled'
      }, customOptions);
      var title = $('.jqf-window-title');
      $(title).text(options.title, function() {
        options.onRetitle.call();
      });
    }
  }; // End Functions

  $.fn.jqfDrawers = function(customOptions) { // Begin Drawers
    var options = $.extend({}, customOptions);
    return this.each(function(i, drawers) {
      $(drawers).children('div').each(function(i, newDrawer) {
        $(newDrawer).addClass('jqf-drawer');
      });
      $(drawers).addClass('jqf jqf-drawers');
      $('.jqf-drawer:last', drawers).addClass('jqf-last');
      $('.jqf-drawer', drawers).each(function(i, drawer) {
        $(drawer).before('<div class="jqf-drawer-handle"><span class="jqf-icon jqf-icon-right"></span> ' + $(drawer).attr('title') + '</div>');
        var handle = $(drawer).prev('.jqf-drawer-handle');
        $(handle).toggleClass('jqf-last', $(drawer).is('.jqf-last'));
        $(drawer).hide();
        $(handle).click(function() {
          if($(handle).hasClass('jqf-active')) {
            $.jqf.drawerClose(drawer);
          }
          else {
            $.jqf.drawerOpen(drawer);
          }
        });
      });
      $('.jqf-drawer-handle:first-child', drawers).addClass('jqf-first');
    });
  }; // End Drawers

  $.fn.jqfFilmstrip = function(customOptions) { // Begin Filmstrip
    var options = $.extend({
      frameHeight:100,
      frameWidth:100,
      show:3
    }, customOptions);
    return this.each(function (i, filmstrip) {
      var frameHeight = options.frameHeight + 42;
      var frameWidth = options.frameWidth + 32;
      $(filmstrip).addClass('jqf-filmstrip');
      var frameArray = $(filmstrip).find('> span');
      $(frameArray).wrapAll('<span class="jqf-view"><span class="jqf-reel"/></span>').each(function (i, frame) {
        $(frame).addClass('jqf-frame').css({height:options.frameHeight,width:options.frameWidth});
      });
      var view = $(filmstrip).find('> .jqf-view');
      $(view).css('height', frameHeight + 'px').css('width', frameWidth * options.show + 10 + 'px');
      var reel = $(view).find('> .jqf-reel');
      var pages = Math.ceil($(frameArray).length / options.show);
      var currentPage = 1;
      $(view).before('<button class="jqf-button back"><span class="jqf-icon jqf-icon-left"></span></button>').after('<button class="jqf-button forward"><span class="jqf-icon jqf-icon-right"></span></button>');
      $('button.back', this).click(function () {
        if(currentPage == 1){
          $(reel).animate({left: '-=' + (frameWidth * options.show * (pages -1))});
          currentPage = pages;
        }
        else {
          $(reel).animate({left: '+=' + (frameWidth * options.show)});
          --currentPage;
        }
      });
      $('button.forward', this).click(function () {
        if(currentPage == pages){
          $(reel).animate({left:0});
          currentPage = 1;    
        }
        else{
          $(reel).animate({left: '-=' + (frameWidth * options.show)});
          ++currentPage;
        }
      });
    });
  };// End Filmstrip

  $.fn.jqfFolders = function(customOptions) { // Begin Folders
    var options = $.extend({direction:'horizontal'}, customOptions);
    return this.each(function(i, folders) {
      $(folders).children('div').each(function(i, folder) {
        $(folder).addClass('jqf-folder');
      });
      $(folders).addClass('jqf jqf-folders-' + options.direction).prepend('<div class="jqf-folders-tabs"></div>');
      var tabs = $('.jqf-folders-tabs', folders);
      $('.jqf-folder', folders).each(function(i, folder) {
        $(tabs).append('<span class="jqf-folder-tab">' + $(folder).attr('title') + '</span>')
      });
      $('.jqf-folder-tab:first-child', tabs).addClass('jqf-first');
      $('.jqf-folder-tab:last-child', tabs).addClass('jqf-last');
      $('.jqf-folder-tab', tabs).each(function(i, tab) {
        $(tab).click(function() {
          $.jqf.folderToggle(i, folders);
        });
      });
      $.jqf.folderToggle(0, folders);
    });
  }; // End Folders

  $.fn.jqfMenu = function(customOptions) { // Begin Menu
    var options = $.extend({icon:''}, customOptions);
    return this.each(function(i, select) {
      $(select).hide();
      var iconHTML = '';
      if(options.icon != '') {
        iconHTML = '<span class="jqf-icon jqf-icon-' + options.icon + '"></span> ';
      }
      var selectArray = $('option', select);
      $(select).after('<div class="jqf jqf-menu"><div class="jqf-menu-button">' + iconHTML +
        $(select).attr('title') + ' <span class="jqf-icon jqf-icon-down"></span></div>' +
        '<div class="jqf-menu-choices"></div>' +
      '</div>');
      var menu = $(select).next('.jqf-menu');
      var button = $('.jqf-menu-button', menu);
      var choices = $('.jqf-menu-choices', menu);
      var closeMenu = function() {
        $(choices).slideUp();
        $(button).removeClass('jqf-active');
      };
      $('option', select).each(function(i, option) {
        $(choices).append('<div class="jqf-menu-choice" id="' + $(option).attr('value') + '">' + $(option).text() + '</div>');
      });
      $.each($('.jqf-menu-choice', choices), function(i, choice) {
        $(choice).click(function() {
          closeMenu();
        });
      });
      $(button).click(function() {
        $(choices).slideToggle();
        $(button).toggleClass('jqf-active');
        $(document).keyup(function(event) {
          if (event.keyCode == 27) { // esc key
            closeMenu();
          }
        });
        $(choices).mouseleave(function() {
          closeMenu();
        });
      });
    });
  }; // End Menu

  $.fn.jqfRating = function(customOptions) { // Begin Rating
    var options = $.extend({
      group:0,
      single:0,
      onClick:function(){}
    }, customOptions);
    return this.each(function(i, div) {
      $(div).hide();
      var radioArray = $('input:radio', div);
      var title = $(div).attr('title');
      var titleHTML = '';
      if(title != '') {
        titleHTML = '<div class="jqf-rating-label">' + title + '</div>'
      }
      $(div).after('<div class="jqf jqf-rating">' + titleHTML +
        '<div class="jqf-rating-stars"></div>' +
      '</div>');
      var rating = $(div).next('.jqf-rating');
      var stars = $('.jqf-rating-stars', rating);
      $(radioArray).each(function(i, radio) {
        var active = '';
        if(options.single > i) {
          active = ' jqf-rating-single';
        }
        else if(options.group > i) {
          active = ' jqf-rating-group';
        }
        $(stars).append('<span class="jqf-rating-star' + active + '" title ="' + $(radio).attr('title') + '"></span>');
      });
      var starChange = function(changedStarCount, starType) {
        $('.jqf-rating-star', stars).each(function(i, star) {
          $(star).removeClass('jqf-rating-single').removeClass('jqf-rating-group');
          if(changedStarCount > i) {
            $(star).addClass('jqf-rating-' + starType);
          }
        });
      }
      $('.jqf-rating-star', stars).each(function(i, star) {
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
          options.single = i + 1
          starChange(options.single, 'single');
          options.onClick.call($(starCurrent));
        });
      });
    });
  }; // End Rating

  $.fn.jqfSlider = function(customOptions) { // Begin Slider
    var options = $.extend({
      onDrag:function(){},
      onStop:function(){},
      unit:20
    }, customOptions);
    return this.each(function(i, select) {
      $(select).hide();
      var selectArray = $('option', select);
      var width = selectArray.length * options.unit;
      var index = $(':selected', select).index();
      var choice = $(selectArray)[index];
      var choiceText = $(choice).text();
      $(select).after('<div class="jqf jqf-slider" id="jqf-slider-' + $(select).attr('id') + '">' +
        '<div class="jqf-slider-label">' + $(select).attr('title') + '</div>' +
        '<span class="jqf-slider-bevel">' +
          '<div class="jqf-slider-track"><div class="jqf-slider-level"></div><div class="jqf-slider-button"></div></div>' +
          '<div class="jqf-slider-text jqf-ellipsis" title="' + choiceText + '">' + choiceText + '</div>' +
        '</span>' +
      '</div>');
      var slider = $(select).next('.jqf-slider');
      var bevel = $('.jqf-slider-bevel', slider);
      var track = $('.jqf-slider-track', slider);
      var level = $('.jqf-slider-level', slider);
      var button = $('.jqf-slider-button', slider);
      var text = $('.jqf-slider-text', slider);
      $(track).css('width', width + 'px');
      $(text).css('width', width + 'px');
      $(level).css('width', index * options.unit + options.unit + 'px');
      $(button).css('left', index * options.unit + 'px').css('width', options.unit);
      $(button).draggable({
        addClasses:false,
        axis:'x',
        containment:bevel,
        drag:function() {
          index = Math.round($(button).position().left/options.unit);
          $(level).css('width', index * options.unit + options.unit + 'px');
          choice = $(selectArray)[index];
          choiceText = $(choice).text();
          $('.jqf-slider-text', bevel).remove();
          $(bevel).append('<div class="jqf-slider-text jqf-ellipsis" title="' + choiceText + '">' + choiceText + '</div>');
          $('.jqf-slider-text', bevel).css('width', width + 'px');
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
    });
  }; // End Slider

  $.fn.jqfWindow = function(customOptions) { // Begin Window
    var options = $.extend({}, customOptions);
    return this.each(function(i, opener) {
      $(opener).click(function(event) {
        event.preventDefault();
        if($(opener).is('a') && !$(opener).attr('name')) {
          options.url = $(opener).attr('href');
        }
        else {
          options.url = $(opener).attr('name');
        }
        options.title = $(opener).attr('title');
        $.jqf.windowOpen(options);
      });
    });
  }; // End Window

})(jQuery); // End jqFace
