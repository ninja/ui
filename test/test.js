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

  /* Button */
  var $button = $.ninja().button({
    html: 'Default'
  }),
  $buttonStates = $.ninja().button({
    html: 'Disabled'
  }).deselect(function () {
    console.log('Deselected button.');
  }).enable(function () {
    console.log('Enabled button.');
  }).select(function () {
    console.log('Selected button.');
  }),
  $buttonChangeState = $.ninja().button({
    html: 'Disable/Enable',
    select: true
  }).toggle(function () {
    $buttonStates.enable();
  }, function () {
    $buttonStates.disable();
  }),
  $buttonIcon = $.ninja().button({
    html: $('<span/>').append($.ninja().icon('home'), ' With Icon')
  });
  $body.append($title.clone().text('Button'), $button, ' ', $buttonIcon, ' ', $buttonStates, ' ', $buttonChangeState);
  $buttonStates.disable().disable(function () {
    console.log('Disabled button.');
  });
  
  /* Drawer */
  var $drawer = $.ninja().drawer({
    html: 'Content of the drawer',
    title: 'Open Sesame'
  });
  $body.append($title.clone().text('Drawer'), $drawer);

  /* Icon */
  var $icons = $('<div/>');
  $.each(['home', 'at', 'quote', 'quoteAlt', 'arrowUp', 'arrowRight', 'arrowBottom', 'arrowLeft', 'arrowUpAlt', 'arrowRightAlt', 'arrowBottomAlt', 'arrowLeftAlt', 'move', 'moveVertical', 'moveHorizontal', 'moveAlt', 'moveVerticalAlt', 'moveHorizontalAlt', 'cursor', 'plus', 'plusAlt', 'minus', 'minusAlt', 'newWindow', 'dial', 'lightbulb', 'link', 'image', 'article', 'readMore', 'headphones', 'equalizer', 'fullscreen', 'exitFullscreen', 'spin', 'spinAlt', 'moon', 'sun', 'mapPin', 'pin', 'eyedropper', 'denied', 'calendar', 'calendarAlt', 'bolt', 'clock', 'document', 'book', 'bookAlt', 'magnifyingGlass', 'tag', 'heart', 'info', 'chat', 'chatAlt', 'key', 'unlocked', 'locked', 'mail', 'mailAlt', 'phone', 'box', 'pencil', 'pencilAlt', 'comment', 'commentAlt', 'rss', 'star', 'trash', 'user', 'volume', 'mute', 'cog', 'cogAlt', 'x', 'xAlt', 'check', 'checkAlt', 'beaker', 'beakerAlt'
  ], function (i, name) {
    if (i !== 0) {
      $icons.append(' ');
    }
    $icons.append($.ninja().icon(name));
  });
  $body.append($title.clone().text('Icon'), $icons);
  
  /* Pop-Up */
  var $bubbleButton;
  var $buttonBubble = $.ninja().button({
    html: 'Pop-Up'
  }).select(function () {
    $bubbleButton = $buttonBubble.bubble();
    $bubbleButton.html($('<div/>', {
      css: {
        whiteSpace: 'nowrap'
      },
      text: 'Button bubble content loaded via ninja().html().'
    }));
  }).deselect(function () {
    $bubbleButton.detach();
  });
  var $bubbleList;
  var $buttonListBubble = $.ninja().button({
    html: 'Pop-Up List'
  }).select(function () {
    $bubbleList = $buttonListBubble.bubble();
    $bubbleList.html($.ninja().list({
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
    }).select(function (event) {
      console.log('Global select function called returning: ' + $(event.html).text());
      $bubbleList.detach();
    }));
  }).deselect(function () {
    $bubbleList.detach();
  });

  var $spinner = $('<span/>', {
    className: 'ninja ninjaInline',
    css: {
      backgroundImage: 'url("../lib/images/wait.png")',
      height: '16px',
      width: '16px'
    }
  }).ninja().spin();
  var $bubbleWindow;
  var $buttonWindowBubble = $.ninja().button({
    html: 'Pop-Up Window'
  }).select(function () {
    $bubbleWindow = $buttonWindowBubble.ninja().bubble({
      html: ' Loading...',
      pop: true,
      window: true
    }).prepend($spinner);
    /* Fake asynchronous delay */
    setTimeout(function () {
      $bubbleWindow.html('Document body bubble content loaded via ninja().html().');
    }, 2000);
  }).deselect(function () {
    $bubbleWindow.detach();
  });
  $body.append($title.clone().text('Pop-Up'), $buttonBubble, ' ', $buttonListBubble, ' ', $buttonWindowBubble);

  /* Rating */
  var $rating = $.ninja().rating({
    choices: [{
      html: $('<div/>', {
        text: 'One star.'
      }),
      select: function () {
        console.log('Local select function called.');
      }
    },
    {
      html: $('<div/>', {
        text: 'Two stars.'
      })
    },
    {
      html: $('<div/>', {
        text: 'Three stars.'
      })
    },
    {
      html: $('<div/>', {
        text: 'Four stars.'
      })
    },
    {
      html: $('<div/>', {
        text: 'Five stars.'
      })
    }],
    starsAverage: 3
  }).select(function (event) {
    console.log('Global select function called returning: ' + event.html.text());
  });
  $body.append($title.clone().text('Rating'), $rating);

  /* Slider */
  var $slider = $.ninja().slider({
    choices: [{
      html: '0 dB',
      select: function (event) {
        console.log(event.choice.html);
      }
    },
    {
      html: '10 dB',
      select: function (event) {
        console.log(event.choice.html + ': Light leaf rustling, calm breathing');
      }
    },
    {
      html: '20-30 dB',
      select: function (event) {
        console.log(event.choice.html + ': Very calm room');
      }
      
    },
    {
      html: '40-60 dB',
      select: function (event) {
        console.log(event.choice.html + ': Normal conversation at 1 m');
      }
    },
    {
      html: '60 dB',
      select: function (event) {
        console.log(event.choice.html + ': TV set at home level at 1 m');
      }
    },
    {
      html: '60-80 dB',
      select: function (event) {
        console.log(event.choice.html + ': Passenger car at 10 m');
      }
    },
    {
      html: '78 dB',
      select: function (event) {
        console.log(event.choice.html + ': Hearing damage over long-term exposure, need not be continuous');
      }
    },
    {
      html: '80-90 dB',
      select: function (event) {
        console.log(event.choice.html + ': Traffic on a busy roadway at 10 m');
      }
    },
    {
      html: '100 dB',
      select: function (event) {
        console.log(event.choice.html + ': Jack hammer at 1 m');
      }
    },
    {
      html: '120 dB',
      select: function (event) {
        console.log(event.choice.html + ': Hearing damage immediately possible');
      }
    },
    {
      html: '130 dB',
      select: function (event) {
        console.log(event.choice.html + ': Threshold of pain');
      }
    },
    {
      html: '150 dB',
      select: function (event) {
        console.log(event.choice.html + ': Jet engine at 30 m');
      }
    },
    {
      html: '168 dB',
      select: function (event) {
        console.log(event.choice.html + ': M1 Garand rifle being fired at 1 m');
      }
    }],
    slot: 3,
    title: 'Volume'
  }).select(function (event) {
    console.log('Slider returns: ' + event.choice.html);
  });
  $body.append($title.clone().text('Slider'), $slider);

  /* Suggest */
  var $suggest = $.ninja().suggest({
    html: $.ninja().icon('magnifyingGlass'),
    placeholder: 'Ninja UI Search',
    width: '50%'
  }).change(function (event) {
    $.ajax({
      url: 'http://clients1.google.com/complete/search',
      dataType: 'jsonp',
      data: {
        q: event.value,
        ds: '',
        nolabels: 't'
      },
      success: function (data, message) {
        $suggest.update({
          choices: $.map(data[1], function (item) {
            return {
              html: item[0]
            };
          })
        });
      },
      error: function (request, status, error) {
        console.error(error);
        $suggest.update({
          choices: [{
            html: $('<div/>', {
              css: {
                color: 'red'
              },
              text: 'Server error: ' + error
            }),
            spacer: true
          }]
        });
      },
      timeout: 4000
    });  
  }).select(function (event) {
    console.log('Global select function called returning: ' + event.html);
  });
  $body.append($title.clone().text('Suggest'), $suggest);
  
}(jQuery));