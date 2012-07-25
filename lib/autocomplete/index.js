exports.create = function (model, dom) {
  (function ($) {
    'use strict';

    if ($.ninja === undefined) {
      require('../ninja');
    }

    $('input#q').ninja().assemble({
      element: 'autocomplete'
    });
  }(jQuery));
};

exports.init = function (model) {
};
