/*
  Copyright 2008-2012 Jamie Hoover.
  Licensed per the terms of the Apache License v2.0. See Readme.md for more details.
*/

"use strict";

var
  colors = require('colors'),
  /*bold, italic, underline, inverse, yellow, cyan, white, magenta, green, red, grey, blue, rainbow*/
  exec = require('child_process').exec,
  fs = require('fs'),
  jshint = require('jshint').JSHINT,
  less = require('less'),
  path = require('path'),
  uglify = require('uglify-js'),
  base64css,
  dirsrc = './src/',
  dirtest = './test/',
  version = JSON.parse(fs.readFileSync('./package.json', 'utf8')).version,
  dirdist = './dist/' + version + '/',
  filesrc = dirsrc + 'ninjaui.js',
  filedist = dirdist + 'jquery.ninjaui.js',
  filemin = dirdist + 'jquery.ninjaui.min.js',
  iconPass = '\u2714'.green,
  iconFail = '\u2717'.red;

desc('Default task.');
task('default', ['messageBuild', 'test'], function () {
  console.log(('testing...').underline);
});

desc('Lint JavaScript file.');
task('lint', function () {
  var
    buffer = fs.readFileSync(filesrc, 'utf8'),
    config = JSON.parse(fs.readFileSync(dirtest + 'jshint.json', 'utf8')
      .replace(/\/\*[\s\S]*(?:\*\/)/g, '') //remove everything between "/* */"
      .replace(/\/\/[^\n\r]*/g, '') //remove everything after "//"
    );

  if (jshint(buffer, config)) {
    console.log(iconPass, 'linted:       ', filesrc);
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
});

desc('Build JavaScript file.');
task('build', ['lint'], function () {
  var
    fileless = dirsrc + 'less/index.less',
    parser = new(less.Parser)({
      paths: [dirsrc + 'less'],
      filename: fileless
    });

  if (!path.existsSync(dirdist)) {
    fs.mkdirSync(dirdist);
  }

  parser.parse(fs.readFileSync(fileless, 'utf8'), function (error, tree) {
    if (error) {
      console.error(iconFail, 'syntax errors:', error.filename);
      console.error(' ', error.line + ',' + error.column, '      ', error.extract[1].red);
      process.exit(1);
    }

    base64css = 'data:text/css;base64,' + new Buffer(tree.toCSS({
      compress: true
    })).toString('base64');

    console.log(iconPass, 'compiled:     ', fileless);

    fs.writeFileSync(
      dirdist + 'jquery.ninjaui.js',
      fs.readFileSync(dirsrc + 'ninjaui.js', 'utf8')
        .replace(/development/g, version)
        .replace('stylesheet/less', 'stylesheet')
        .replace(
          '../src/less/index.less',
          base64css),
      'utf8'
    );
  });

  console.log(iconPass, 'created:      ', filedist);
});

desc('Minify JavaScript file.');
task('minify', ['build'], function () {
  var
    copyright = '/*! Ninja UI v' + version + ' ninjaui.com | ninjaui.com/#license */\n',
    javascript = uglify(fs.readFileSync(dirdist + 'jquery.ninjaui.js', 'utf8'));

  fs.writeFileSync(dirdist + 'jquery.ninjaui.min.js', copyright + javascript, 'utf8');

  console.log(iconPass, 'minified:     ', filemin);
});

desc('Test minified JavaScript.');
task('test', ['minify'], function () {
  var
    jsdom = require('jsdom'),
    assert = require('assert'),
    testCount = 0,
    versionCount = 1,
    test = function ($, name, fn) {
      try {
        fn();
      } catch (error) {
        console.error(iconFail, 'test failed:  ', name, '(jQuery', $.fn.jquery + ')');
        console.error('                ', error.message.bold);
        process.exit(1);
      }
      if (versionCount === 1) {
        testCount++;
      }
    },
    versions = ['1.7.1', '1.7.0', '1.6.4', '1.6.3', '1.6.2', '1.6.1', '1.6.0'];

  versions.forEach(function (jQueryVersion) {

    jsdom.env({
      html: '<html><head></head><body></body></html>',
      src: [
        fs.readFileSync(dirtest + 'jquery/' + jQueryVersion + '.min.js', 'utf8'),
        fs.readFileSync(filemin, 'utf8')
      ],
      done: function (errors, window) {
        if (errors) {
          console.error(errors);
          process.exit(1);
        }
        var
          $ = window.$,
          document = window.document;
        require(dirtest + 'core.js')($, window, document, test, assert, version);
        require(dirtest + 'button.js')($, window, document, test, assert);
        versionCount++;
        if (versionCount === versions.length) {
          console.log(iconPass, 'tested:       ', testCount, 'tests passed', versions.length, 'versions of jQuery(' + versions[versions.length - 1], '-', versions[0] + ')');

        }
      }
    });

  });

});

desc('Watch for changes.');
task('watch', ['messageWatch'], function () {
  var
    spawn = require('child_process').spawn,
    watch = require('nodewatch'),
    busy = false,
    test = null;

  watch.add(dirsrc).add(dirsrc + 'less').add(dirtest).onChange(function (file) {
    if (!busy) {
      busy = true;
      test = spawn('jake', ['default', 'watchMessage']);
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
      });
    }
  });
});

task('messageBuild', function () {
  console.log(('Ninja UI ' + version).bold);
  console.log(('building...').underline);
});

task('messageWatch', function () {
  console.log('Watching Ninja UI code for changes... (CTRL-C to quit)'.yellow);
});

desc('Remove generated files.');
task('clean', function () {
  fs.unlink(dirdist + 'jquery.ninjaui.min.js');
  fs.unlink(dirdist + 'jquery.ninjaui.js');
});

desc('Display version number.');
task('version', function () {
  console.log(version);
});
