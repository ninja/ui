'use strict';

var
  colors = require('colors'),
  /*
    bold, inverse, italic, underline
    blue, cyan, green, grey, magenta, red, white, yellow
  */
  path = require('path'),
  spawn = require('child_process').spawn,
  watch = require('nodewatch'),
  message = 'Watching Ninja UI code for changes...' + '(CTRL-C to quit)'.grey,
  busy = false,
  test;

console.log(message);

watch
  .add('src', true)
  .add('test')
  .onChange(function (file) {
    if (!busy) {
      busy = true;
      console.log('\n  \u0394 change detected'.magenta, ('(' + path.relative('.', file) + path.basename(file) + ')\n').grey);
      if (path.basename(file) === 'ninjaui.js') {
        test = spawn('make', ['hint', 'minify', 'test']);
      } else if (path.extname(file) === '.styl') {
        test = spawn('make', ['minify', 'test']);
      } else if (path.extname(file) === '.js') {
        test = spawn('make', ['test']);
      }
      test.stdout.on('data', function (data) {
        process.stdout.write(data);
      });
      test.stderr.on('data', function (data) {
        process.stderr.write(data);
      });
      test.on('exit', function (code) {
        test.stdout.removeAllListeners('data');
        test.stderr.removeAllListeners('data');
        test.removeAllListeners('exit');
        test = null;
        busy = false;
        console.log(message);
      });
    }
  });
