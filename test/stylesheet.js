describe('stylesheet', function () {

  var $stylesheet;

  it('type should be text/css', function () {
    $stylesheet = $('head').find('link[rel=stylesheet]');
    expect($stylesheet.attr('type')).to.be('text/css');
  });

  it('href should be data:text/css;base64', function () {
    expect($stylesheet.attr('href').substr(0, 21)).to.be('data:text/css;base64,');
  });

});
