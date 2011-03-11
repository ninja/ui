/*global
  jQuery: false,
  window: false
*/

/*jshint
  bitwise: true,
  browser: true,
  eqeqeq: true,
  indent: 2,
  newcap: true,
  nomen: true,
  regexp: true,
  undef: true,
  white: true
*/

(function ($) {
  /* Console */
  var console;
  if (window.console) {
    console = window.console;
  }
  else {
    console = {
      log: function (message) {
        window.alert(message);
      }
    };
  }
  
  var $body = $('body'), $title = $('<h2/>');

  /* Icon */
  var $icon = $('<div/>');
  $.each(['add', 'arrange', 'beverage', 'bookmark', 'caution', 'check', 'down', 'download', 'edit', 'flag', 'food', 'gear', 'group', 'heart', 'home', 'in', 'left', 'lock', 'mail', 'no', 'out', 'phone', 'photo', 'print', 'profile', 'question', 'refresh', 'remove', 'right', 'search', 'star', 'target', 'unlock', 'up', 'upload', 'video'], function (i, name) {
    if (i !== 0) {
      $icon.append(' ');
    }
    $icon.append($.ninja().icon({
      name: name
    }));
  });
  $body.append($title.clone().text('Icon'), $icon);
  
  /* Button */
  var $button = $.ninja().button({
    html: 'Default',
    theme: 'light'
  }),
  $buttonStates = $.ninja().button({
    enable: false,
    html: 'Disabled',
    theme: 'light'
  }).deselect(function () {
    $buttonStates.html('Deselected');
    console.log('Deselected button.');
  }).disable(function () {
    $buttonStates.html('Disabled');
    console.log('Disabled button.');
  }).enable(function () {
    $buttonStates.html('Enabled');
    console.log('Enabled button.');
  }).select(function () {
    $buttonStates.html('Selected');
    console.log('Selected button.');
  }),
  $buttonChangeState = $.ninja().button({
    html: 'Disable/Enable',
    select: true,
    theme: 'light'
  }).toggle(function () {
    $buttonStates.enable();
  }, function () {
    $buttonStates.disable();
  }),
  $buttonIcon = $.ninja().button({
    html: $('<span/>').append($.ninja().icon({name: 'search'}), ' With Icon'),
    theme: 'light'
  });
  $body.append($title.clone().text('Button'), $button, ' ', $buttonIcon, ' ', $buttonStates, ' ', $buttonChangeState);

  /* List */
  var $list = $.ninja().list({
    choices: [{
      html: $('<div/>', {
        text: 'Choose me!'
      }),
      select: function () {
        console.log('Local select function called.');
      }
    },
    {
      html: $('<div/>', {
        text: 'No, choose me!'
      })
    }]
  }).select(function () {
    console.log('Global select function called returning: ' + this);
  });
  $body.append($title.clone().text('List'), $list);
  
  /* Bubble */
  var $bubbleButton;
  var $buttonBubble = $.ninja().button({
    html: 'Button Bubble'
  }).select(function () {
    $bubbleButton = $buttonBubble.bubble();
    $bubbleButton.update($('<div/>', {
      css: {
        whiteSpace: 'nowrap'
      },
      text: 'Button bubble content loaded via ninja().update().'
    }));
  }).deselect(function () {
    $bubbleButton.pop();
  });

  var $bubbleList;
  var $buttonListBubble = $.ninja().button({
    html: 'List Bubble'
  }).select(function () {
    $bubbleList = $buttonListBubble.bubble();
    $bubbleList.update($.ninja().list({
      choices: [{
        html: $('<div/>', {
          text: 'Choose me!'
        }),
        select: function () {
          console.log('Local select function called.');
        }
      },
      {
        html: $('<hr/>'),
        spacer: true
      },
      {
        html: $('<div/>', {
          text: 'No, choose me!'
        })
      }]
    }).select(function () {
      console.log('Global select function called returning: ' + this);
      $bubbleList.pop();
    }));
  }).deselect(function () {
    $bubbleList.pop();
  });

  var $bubbleWindow;
  var $buttonWindowBubble = $.ninja().button({
    html: 'Window Bubble'
  }).select(function () {
    $bubbleWindow = $buttonWindowBubble.ninja().bubble({
      html: 'Loading...',
      pop: true,
      window: true
    });
    /* Fake asynchronous delay */
    setTimeout(function () {
      $bubbleWindow.update('Document body bubble content loaded via ninja().update().');
    }, 1000);
  }).deselect(function () {
    $bubbleWindow.pop();
  });
  $body.append($title.clone().text('Bubble'), $buttonBubble, ' ', $buttonListBubble, ' ', $buttonWindowBubble);

/*
    $('#drawerDefault').ninja().create('drawer', {
      title: 'Default',
      width: '50%'
    });
    $('#drawerSelected').ninja().create('drawer', {
      isSelected: true,
      title: 'Selected',
      width: '50%'
    });
    $('#drawerToggle').click(function () {
      if ($('#drawerDefault').data().options.isSelected) {
        $('#drawerDefault').ninja().deselect();
      }
      else {
        $('#drawerDefault').ninja().select();
      }
    });
    
    var menu = $('#menu').ninja().create('menu', {
      icon: 'profile',
      onSelect: function () {
        var options = this;
        if (options.value === '1') {
          window.alert(options.name + ' is correct!');
        }
        else {
          window.alert(options.name + ' is not correct, please try again.');
        }
      },
      title: 'The President?',
      names: ['Barrack Obama', 'George Bush Jr.', 'Bill Clinton', 'George Bush Sr.', 'Ronald Reagan', 'Jimmy Carter'],
      values: [1, 2, 3, 4, 5, 6]
    });

    $('#panel').ninja().create('panel', {
      icon: 'caution',
      title: 'Default'
    });
    
    $('#ratingDefault').ninja().create('rating', {
      colors: {
        selected: { backgroundColor: 'gold' }
      },
      onSelect: function () {
        console.log('Ninja ui: Rating changed to ' + this.selected);
      },
      values: [1, 2, 3, 4, 5]
    });

    $('#ratingSelectedGroup').ninja().create('rating', {
      colors: {
        selected: { backgroundColor: 'gold' },
        selectedGroup: { backgroundColor: 'red' }
      },
      onSelect: function () {
        console.log('Ninja ui: Rating changed to ' + this.selected);
      },
      selectedGroup: 4,
      values: [1, 2, 3, 4, 5]
    });

    $('#ratingSelected').ninja().create('rating', {
      colors: {
        selected: { backgroundColor: 'gold' }
      },
      onSelect: function () {
        console.log('Ninja ui: Rating changed to ' + this.selected);
      },
      selected: 4,
      values: [1, 2, 3, 4, 5]
    });

    var slider = $('#slider').ninja().create('slider', {
      names: ['0 dB', '10 dB (Light leaf rustling, calm breathing)', '20-30 dB (Very calm room)', '40-60 dB (Normal conversation at 1 m)', '60 dB (TV set at home level at 1 m)', '60-80 dB (Passenger car at 10 m)', '78 dB (Hearing damage over long-term exposure, need not be continuous)', '80-90 dB (Traffic on a busy roadway at 10 m)', '100 dB (Jack hammer at 1 m)', '120 dB (Hearing damage immediately possible)', '130 dB (Threshold of pain)', '150 dB (Jet engine at 30 m)', '168 dB (M1 Garand rifle being fired at 1 m)'],
      onSelect: function () {
        console.log('Ninja ui: Slider changed to value:' + this.value + ', name:' + this.name + '.');
        if ($(this).val() === '168') {
          $('#sliderSelect').unbind('click').click(function (event) {
            event.preventDefault();
          }).css({ color: 'black', cursor: 'default', textDecoration: 'none' });
        }
        else {
          $('#sliderSelect').unbind('click').click(function () {
            slider.ninja().select({ value: '168' });
          }).css({ color: 'blue', cursor: 'pointer', textDecoration: 'underline' });
        }
      },
      title: 'Volume',
      value: '40-60',
      values: ['0', '10-10', '20-30', '40-60', '60', '60-80', '78', '80-90', '100', '120', '130', '150', '168'],
      width: 400
    });

    $('#sliderSelect').click(function () {
      slider.ninja().select({ value: '168' });
    }).css({ color: 'blue' });
    
    var suggest = $('#suggest').ninja().create('suggest', {
      icon: 'search',
      title: 'Recipes',
      onUpdate: function () {
        if ($.inArray(this.value, ['a', 'ac', 'aco', 'acor', 'acorn', 'ap', 'app', 'appl', 'apple', 'av', 'avo', 'avoc', 'avoca', 'avocad', 'avocado']) > -1) {
          $(this.list).ninja().update({ values: ['acorn', 'apple', 'avocado'] });
        }
        else {
          $(this.list).ninja().update({ values: ['icecream', 'cake', 'pie'] });
        }
      },
      onSelect: function () {
        console.log('Ninja ui: Suggest selected with value: ' + this.value);
      },
      values: ['one', 'two', 'three'],
      width: '50%'
    });

    $('#suggestButton').ninja().create('button', {
      onSelect: function () {
        suggest.ninja().select();
      },
      title: 'Search'
    });

    $('#suggestSelect').click(function () {
      $('#suggest').ninja().select();
    });

    $('#disableSlider').toggle(function () {
      slider.ninja().disable({
        message: 'Click Wait/Resume link again to resume.'
      });
    }, function () {
      slider.ninja().enable();
    });
    
    $('#disableMenu').toggle(function () {
      menu.ninja().disable({
        message: 'Click Wait/Resume link again to resume.'
      });
    }, function () {
      menu.ninja().enable();
    });
    
    var body = $(document.body);
    $('#disableBody').toggle(function () {
      body.ninja().disable({
        message: 'Click Wait/Resume link again to resume.'
      });
    }, function () {
      body.ninja().enable();
    });
    
    var windowObject = $('#createWindowObject').toggle(function () {
      windowObject.ninja().create('window', {
        onCreate: function () {
          $(this).ninja().update({
            body: $('<div/>', {
              text: 'Object window content goes here.'
            })
          });
        },
        onDestroy: function () {
          console.log('Ninja ui: Window object destroyed.');
        }
      });
    }, function () {
      windowObject.ninja().destroy();
    });
    
    $('#createWindowBody').click(function () {
      body.ninja().create('window', {
        onCreate: function () {
          $(this).ninja().update({
            body: $('<div/>', {
              html: $('<div/>', {
                css: {
                  marginBottom: '1em'
                },
                text: 'Body window content goes here.'
              })
            }).append($('<span/>', {
              text: 'Destroy Window'
            }).ninja().create('button', {
              onSelect: function () {
                body.ninja().destroy();
              }
            }))
          });
        },
        onDestroy: function () {
          console.log('Ninja ui: Window body destroyed.');
        }
      });
    });
*/
}(jQuery));