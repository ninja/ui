describe('table', function () {
  var $table = $('table.nui-tbl');

  it('background-color', function () {
    expect($table.css('background-color')).to.be('rgb(255, 255, 255)');
  });

  describe('odd row', function () {
    var $td = $table.find('tr:nth-child(odd) td');

    it('background-color', function () {
      expect($td.css('background-color')).to.be('rgb(242, 242, 242)');
    });
  });

});
