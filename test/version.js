describe('$.ninja.version()', function () {

  it('should be package.json\'s { "version" }', function () {
    expect($.ninja.version()).to.be(version);
  });

});
