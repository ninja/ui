$versions('1.5', '1.5.1', '1.5.2').load('../lib/jquery.ninja.ui.js').execute(function($, jQuery, version) {
  module('With jQuery ' + version);

  test('should load jQuery and Ninja UI.', function() {
    equal(jQuery.fn.jquery, version, 'jQuery ' + version + ' loaded.');
    ok($.ninja(), 'Ninja UI loaded.');
  });
});
