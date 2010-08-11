//= require "jquery-ui-1.8.4.custom.min"
//= provide "../assets"
(function($) {

  $.nui = { // Begin Functions
    drawerClose: function(drawer){
      var handle = $(drawer).prev('.nui-drawer-handle');
      var icon = $('.nui-icon', handle);
      $(drawer).slideUp(function() {
        $(handle).removeClass('nui-active').toggleClass('nui-last', $(drawer).is('.nui-last'));
        $(icon).addClass('nui-icon-right').removeClass('nui-icon-down');
      });
    },
    drawerOpen: function(drawer){
      var handle = $(drawer).prev('.nui-drawer-handle');
      var icon = $('.nui-icon', handle);
      $(handle).addClass('nui-active').removeClass('nui-last');
      $(icon).addClass('nui-icon-down').removeClass('nui-icon-right');
      $(drawer).slideDown();
    },
    drawersClose: function(drawers){
      $.each(drawers, function(i, drawer) {
        $.nui.drawerClose(drawer);
      });
    },
    drawersOpen: function(drawers){
      $.each(drawers, function(i, drawer) {
        $.nui.drawerOpen(drawer);
      });
    },
    folderToggle: function(position, folders){
      var tabs = $('.nui-tabs', folders);
      $('.nui-tab', tabs).each(function(i, tab) {
        if(i == position) {
          $(tab).addClass('nui-active');
        }
        else {
          $(tab).removeClass('nui-active');
        }
      });
      $('.nui-folder', folders).each(function(i, folder) {
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
        frame:$('.nui-window-frame'),
        overlay:$('.nui-window')
      }, customOptions);
      var overlayMiddleHorizontal = parseInt($(options.overlay).width() / 2);
      var top = $(window).scrollTop();
      var overlayHeight = $(options.overlay).height();
      if(top > 0) {
        var overlayMiddleVertical = parseInt((overlayHeight / 2) + top);
      }
      else if(overlayHeight > $(window).height()) {
        var overlayMiddleVertical = parseInt($(window).height() / 2);
      }
      else {
        var overlayMiddleVertical = parseInt(overlayHeight / 2);
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
      $(options.object).css('position', 'relative').append('<div class="nui nui-wait">' +
        '<div class="nui-wait-frame">' +
          options.content + '<div class="nui-wait-reflection"></div>' +
        '</div>' +
      '</div>');
      var overlay = $('.nui-wait', options.object);
      var frame = $('.nui-wait-frame', overlay);
      $(overlay).fadeIn(function() {
        $(overlay).css('filter', 'progid:DXImageTransform.Microsoft.Gradient(StartColorStr=#80ffffff, EndColorStr=#80ffffff)');
        $.nui.framePosition({frame:frame, overlay:overlay});
        $(frame).fadeIn(function() {
          $(frame).css('filter', 'progid:DXImageTransform.Microsoft.Gradient(StartColorStr=#c0000000, EndColorStr=#c0000000)');
          if(options.seconds > 0) {
            var milliseconds = options.seconds * 1000;
            setTimeout(function() {
              $.nui.waitStop({
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
      var overlay = $('.nui-wait', options.object);
      var frame = $('.nui-wait-frame', overlay);
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
      var overlay = $('.nui-window');
      var frame = $('.nui-window-frame');
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
      $(document.body).append('<div class="nui-window"></div>' +
        '<div class="nui nui-window-frame">' +
          '<div class="nui-bar"><span class="nui-window-title">' +
            options.title + '</span><button class="nui-button nui-window-close"><span class="nui-icon nui-icon-close"></span></button>' +
          '</div>' +
          '<div class="nui-window-content"></div>' +
          '<div class="nui-window-reflection"></div>' +
        '</div>').keyup(function(event) {
        if (event.keyCode == 27) { // esc key
          $.nui.windowClose(options);
        }
      });
      var overlay = $('.nui-window');
      $(window).resize(function() {
        $.nui.framePosition({frame:$(frame), overlay:$(overlay)});
      });
      var frame = $('.nui-window-frame');
      var handle = $('.nui-window-handle', frame);
      $(frame).click(function(event) {
        event.stopPropagation();
      }).draggable({
        containment:$(overlay),
        cursor:'pointer',
        handle:$(handle)
      });
      var content = $('.nui-window-content', frame);
      $(content).load(options.url, function() {
        $('.nui-window-close', frame).click(function() {
          $.nui.windowClose(options);
        });
        $(overlay).css('filter', 'alpha(opacity = 75)').fadeIn(function() {
          $.nui.framePosition({frame:$(frame), overlay:$(overlay)});
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
      var title = $('.nui-window-title');
      $(title).text(options.title, function() {
        options.onRetitle.call();
      });
    }
  }; // End Functions

  $.fn.nuiDrawers = function(customOptions) { // Begin Drawers
    var options = $.extend({}, customOptions);
    return this.each(function(i, drawers) {
      $(drawers).children('div').each(function(i, newDrawer) {
        $(newDrawer).addClass('nui-drawer');
      });
      $(drawers).addClass('nui nui-drawers');
      $('.nui-drawer:last', drawers).addClass('nui-last');
      $('.nui-drawer', drawers).each(function(i, drawer) {
        $(drawer).before('<div class="nui-drawer-handle"><span class="nui-icon nui-icon-right"></span> ' + $(drawer).attr('title') + '</div>');
        var handle = $(drawer).prev('.nui-drawer-handle');
        $(handle).toggleClass('nui-last', $(drawer).is('.nui-last'));
        $(drawer).hide();
        $(handle).click(function() {
          if($(handle).hasClass('nui-active')) {
            $.nui.drawerClose(drawer);
          }
          else {
            $.nui.drawerOpen(drawer);
          }
        });
      });
      $('.nui-drawer-handle:first-child', drawers).addClass('nui-first');
    });
  }; // End Drawers

  $.fn.nuiFilmstrip = function(customOptions) { // Begin Filmstrip
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
      $(filmstrip).prepend('<span class="nui-bar"><button class="nui-button back"><span class="nui-icon nui-icon-left"></span></button>' + options.title + '<button class="nui-button forward"><span class="nui-icon nui-icon-right"></span></button></span>');
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
  };// End Filmstrip

  $.fn.nuiFolders = function(customOptions) { // Begin Folders
    var options = $.extend({direction:'horizontal'}, customOptions);
    return this.each(function(i, folders) {
      $(folders).children('div').each(function(i, folder) {
        $(folder).addClass('nui-folder');
      });
      $(folders).addClass('nui nui-folders nui-' + options.direction).prepend('<div class="nui-tabs"></div>');
      var tabs = $('.nui-tabs', folders);
      var folderArray = $('.nui-folder', folders);
      $(folderArray).each(function(i, folder) {
        $(tabs).append('<span class="nui-tab">' + $(folder).attr('title') + '</span>')
      });
      $('.nui-tab:first-child', tabs).addClass('nui-first');
      $('.nui-tab:last-child', tabs).addClass('nui-last');
      $(folderArray).each(function(i, folder) {
        $(folder).css('min-height', $(tabs).height());
      });
      $('.nui-tab', tabs).each(function(i, tab) {
        $(tab).click(function() {
          $.nui.folderToggle(i, folders);
        });
      });
      $.nui.folderToggle(0, folders);
    });
  }; // End Folders

  $.fn.nuiMenu = function(customOptions) { // Begin Menu
    var options = $.extend({icon:''}, customOptions);
    return this.each(function(i, select) {
      $(select).hide();
      var iconHTML = '';
      if(options.icon != '') {
        iconHTML = '<span class="nui-icon nui-icon-' + options.icon + '"></span> ';
      }
      var selectArray = $('option', select);
      $(select).after('<div class="nui nui-menu"><div class="nui-button">' + iconHTML +
        $(select).attr('title') + ' <span class="nui-icon nui-icon-down"></span></div>' +
        '<div class="nui-menu-choices"></div>' +
      '</div>');
      var menu = $(select).next('.nui-menu');
      var button = $('.nui-button', menu);
      var choices = $('.nui-menu-choices', menu);
      var closeMenu = function() {
        $(choices).slideUp();
        $(button).removeClass('nui-active');
      };
      $('option', select).each(function(i, option) {
        $(choices).append('<div class="nui-menu-choice" id="' + $(option).attr('value') + '">' + $(option).text() + '</div>');
      });
      $.each($('.nui-menu-choice', choices), function(i, choice) {
        $(choice).click(function() {
          closeMenu();
        });
      });
      $(button).click(function() {
        $(choices).slideToggle();
        $(button).toggleClass('nui-active');
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

  $.fn.nuiRating = function(customOptions) { // Begin Rating
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
        titleHTML = '<div class="nui-rating-label">' + title + '</div>'
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
      }
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
          options.single = i + 1
          starChange(options.single, 'single');
          options.onClick.call($(starCurrent));
        });
      });
    });
  }; // End Rating

  $.fn.nuiSlider = function(customOptions) { // Begin Slider
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
        var slider = $(select).parents('.nui-slider');
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
  }; // End Slider

  $.fn.nuiWindow = function(customOptions) { // Begin Window
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
        $.nui.windowOpen(options);
      });
    });
  }; // End Window

})(jQuery);
