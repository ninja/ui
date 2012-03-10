"use strict";

var
  version = require('../package.json').version,
  copyright = '/*! Ninja UI v' + version + ' ninjaui.com | ninjaui.com/#license */\n',

  colors = require('colors'),
  /*
    bold, inverse, italic, underline
    blue, cyan, green, grey, magenta, red, white, yellow
  */
  iconPass = '\u2714'.green,
  iconFail = '\u2717'.red,

  path = require('path'),
  dirsrc = path.resolve(__dirname, '..', 'src'),
  dirdist = path.resolve(__dirname, '..', 'dist', version),

  filesrc = path.resolve(dirsrc, 'ninjaui.js'),
  filedist = path.resolve(dirdist, 'jquery.ninjaui.js'),
  filedistmin = path.resolve(dirdist, 'jquery.ninjaui.min.js'),

  fs = require('fs'),

  jshint = require('jshint').JSHINT,
  buffer = fs.readFileSync(filesrc, 'utf8'),
  config = JSON.parse(fs.readFileSync(path.resolve(dirsrc, '.jshintrc'), 'utf8')
    .replace(/\/\*[\s\S]*(?:\*\/)/g, '') //remove everything between "/* */"
    .replace(/\/\/[^\n\r]*/g, '') //remove everything after "//"
  ),

  less = require('less'),
  fileless = path.resolve(dirsrc, 'less', 'index.less'),
  parser = new(less.Parser)({
    paths: [path.resolve(dirsrc, 'less')],
    filename: fileless
  }),

  uglify = require('uglify-js');

console.log();
console.log('Bulding Ninja UI', version);
console.log();

if (jshint(buffer, config)) {
  console.log(iconPass, 'linted:', filesrc);
} else {
  console.error(iconFail, 'syntax errors:', filesrc);
  jshint.errors.forEach(function (error) {
    if (error) {
      if (error.id) {
        console.error(error.id.red, error.line + ',' + error.character, error.reason);
      } else {
        console.error(error.reason.red);
      }
    }
  });
  process.exit(1);
}

if (!path.existsSync(dirdist)) {
  fs.mkdirSync(dirdist);
}

parser.parse(fs.readFileSync(fileless, 'utf8'), function (error, tree) {
  if (error) {
    console.error(iconFail, 'syntax errors:', error.filename);
    console.error(error.line + ',' + error.column, error.extract[1].red);
    process.exit(1);
  }

  console.log(iconPass, 'compiled:', fileless);

  fs.writeFileSync(
    path.resolve(dirdist, 'jquery.ninjaui.js'),
    fs.readFileSync(path.resolve(dirsrc, 'ninjaui.js'), 'utf8')
      .replace(/development/g, version)
      .replace('stylesheet/less', 'stylesheet')
      .replace(
        '../src/less/index.less',
        'data:text/css;base64,' + new Buffer(tree.toCSS({ compress: true })).toString('base64')
      ),
    'utf8'
  );
});

console.log(iconPass, 'created:', filedist);

fs.writeFileSync(path.resolve(dirdist, 'jquery.ninjaui.min.js'), copyright + uglify(fs.readFileSync(path.resolve(dirdist, 'jquery.ninjaui.js'), 'utf8')), 'utf8');

console.log(iconPass, 'minified:', filedistmin);
console.log();
