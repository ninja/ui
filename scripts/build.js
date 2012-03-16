'use strict';

var
  version = require('package.json').version,
  year = new Date().getFullYear(),

  path = require('path'),
  dirsrc = path.resolve(__dirname, '..', 'src'),
  dirdist = path.resolve(__dirname, '..', 'dist', version),

  filesrc = path.resolve(dirsrc, 'ninjaui.js'),
  filedist = path.resolve(dirdist, 'jquery.ninjaui.js'),
  filedistmin = path.resolve(dirdist, 'jquery.ninjaui.min.js'),

  fs = require('fs'),

  stylus = require('stylus'),
  filestylus = path.resolve(dirsrc, 'css/index.styl');

if (!path.existsSync(dirdist)) {
  fs.mkdirSync(dirdist);
}

stylus.render(fs.readFileSync(filestylus, 'utf8'), function (error, css) {
  if (error) {
    throw error;
  }

  fs.writeFileSync(
    path.resolve(dirdist, 'jquery.ninjaui.js'),
    fs.readFileSync(path.resolve(dirsrc, 'ninjaui.js'), 'utf8')
      .replace(/VERSION/g, version)
      .replace(/YEAR/g, year)
      .replace('../src/css/index.styl', 'data:text/css;base64,' + new Buffer(css).toString('base64')),
    'utf8'
  );
});
