var Config = function () {
  this.ns = 'ninja';

  this.filename = __filename;

  this.styles = [
    __dirname + '/button',
    __dirname + '/table'
  ];

  this.scripts = {
    autocomplete: require('./autocomplete'),
    button: require('./button')
  };
};

function components(derby, options) {
  derby.createLibrary(new Config(), options);
}

components.decorate = 'derby';

module.exports = components;
