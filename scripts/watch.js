"use strict";

var
  colors = require('colors'),
  /*
    bold, inverse, italic, underline
    blue, cyan, green, grey, magenta, red, white, yellow
  */
  path = require('path'),
  spawn = require('child_process').spawn,
  watch = require('nodewatch'),
  message = 'Watching Ninja UI code for changes...'.cyan + '(CTRL-C to quit)'.grey,
  busy = false,
  test = null,
  iconChange = '\u0394'.magenta;

console.log(message);

watch
  .add(path.resolve(__dirname, '..', 'src'), true)
  .add(path.resolve(__dirname, '..', 'test'))
  .onChange(function (file) {
    if (!busy) {
      busy = true;
      console.log(iconChange, 'changed:      ', file.magenta);
      if (path.basename(file) === 'ninjaui.js' || path.extname(file) === '.less') {
        test = spawn('node', ['scripts/build.js']);
      } else if (path.extname(file) === '.js') {
        test = spawn('node', ['scripts/test.js']);
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
