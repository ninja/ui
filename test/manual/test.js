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
    html: $('<span/>').append($.ninja().icon({
      name: 'ninja'
    }), ' With Icon')
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
  $.each($.ninja().icons, function (name, character) {
    var $icon = $.ninja().icon({
      css: {
        fontSize: '2em',
        margin: '0.25em'
      },
      name: name
    }).attr({
      title: name
    }).mouseenter(function () {
      $icon.css({
        color: '#900'
      });
    }).mouseleave(function () {
      $icon.css({
        color: 'black'
      });
    });
    $icons.append($icon);
  });
  $body.append($title.clone().text('Icon'), $icons);
  
  /* Pop-Up */
  var $popup;
  var $buttonPopup = $.ninja().button({
    html: 'Pop-Up'
  }).select(function () {
    $popup = $buttonPopup.popup({
      html: $('<div/>', {
        css: {
          whiteSpace: 'nowrap'
        },
        text: 'Preloaded Content.'
      })
    });
  }).deselect(function () {
    $popup.detach();
  });
  var $popupList;
  var $buttonPopupList = $.ninja().button({
    html: 'Pop-Up List'
  }).select(function () {
    $popupList = $buttonPopupList.popup({
      html: $.ninja().list({
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
        $popupList.detach();
      })
    });
  }).deselect(function () {
    $popupList.detach();
  });

  var $popupWindow;
  var $buttonPopupWindow = $.ninja().button({
    html: 'Pop-Up Window'
  }).select(function () {
    $popupWindow = $buttonPopupWindow.ninja().popup({
      html: $.ninja().spinner(),
      button: true,
      window: true
    });
    /* Fake asynchronous delay */
    setTimeout(function () {
      $popupWindow.update({
        html: 'Content loaded.'
      });
    }, 2000);
  }).deselect(function () {
    $popupWindow.detach();
  });
  $body.append($title.clone().text('Pop-Up'), $buttonPopup, ' ', $buttonPopupList, ' ', $buttonPopupWindow);

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

  /* Spinner */
  var $spinner = $.ninja().spinner({
    css: {
      fontSize: '1.7em'
    },
    speed: 100
  });
  $body.append($title.clone().text('Spinner'), $spinner);

  /* Suggest */
  var $suggest = $.ninja().suggest({
    css: {
      width: '50%'
    },
    html: $.ninja().icon({
      name: 'search'
    }),
    placeholder: 'Ninja UI Search'
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
      error: function (request, status, message) {
        console.error(message);
        $suggest.error(message);
      },
      timeout: 3000
    });  
  }).select(function (event) {
    console.log('Global select function called returning: ' + event.html);
  });
  $body.append($title.clone().text('Suggest'), $suggest);
  
  /* Tabs */
  var $tabs = $.ninja().tabs({
    choices: [{
      html: 'One',
      select: function () {
        console.log('Local tab function called.');
      }
    },
    {
      html: 'Two',
    },
    {
      html: 'Three',
    }],
    choice: 2
  }).select(function (event) {
    console.log('Global tab function called returning: ' + event.html);
  });
  $body.append($title.clone().text('Tabs'), $tabs);
  
}(jQuery));