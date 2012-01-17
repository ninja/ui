/*
  Copyright 2008-2012 Jamie Hoover.
  Licensed per the terms of the Apache License v2.0. See Readme.md for more details.
*/

/*globals desc: false, task: false, file: false, directory: false*/

/*jshint bitwise: true, browser: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 2, node: true, maxerr: 3, newcap: true, noarg: true, noempty: true, nomen: true, nonew: true, onevar: true, plusplus: false, regexp: true, strict: false, undef: true, white: true*/

var
  cleanCSS = require('clean-css'),
  fs = require('fs'),
  uglify = require('uglify-js'),
  pkg = JSON.parse(fs.readFileSync(__dirname + '/package.json', 'utf8')),
  version = pkg.version;

desc('Default task.');
task('default', ['minify'], function () {
  console.log('Ninja UI ' + version + ' build complete. Test URL: file://' + __dirname + '/test/index.html?environment=production');
});

desc('Display version number.');
task('version', function () {
  console.log(version);
});

desc('Build JavaScript file.');
file('build', [__dirname + '/src/ninjaui.css', __dirname + '/src/ninjaui.js'], function () {
  var
    css = new Buffer(cleanCSS.process(fs.readFileSync(__dirname + '/src/ninjaui.css', 'utf8'))),
    js = fs.readFileSync(__dirname + '/src/ninjaui.js', 'utf8').replace(/development/g, version).replace('../src/ninjaui.css', 'data:text/css;base64,' + css.toString('base64'));
  fs.writeFileSync('jquery.ninjaui.js', js, 'utf8');
});

desc('Minify JavaScript file.');
file('minify', ['build', 'jquery.ninjaui.js'], function () {
  var
    copyright = '/*! Ninja UI v' + version + ' ninjaui.com | ninjaui.com/#license */\n',
    js = uglify(fs.readFileSync('jquery.ninjaui.js', 'utf8'));
  fs.writeFileSync('jquery.ninjaui.min.js', copyright + js, 'utf8');
});

desc('Remove generated files.');
task('clean', function () {
  fs.unlink('jquery.ninjaui.min.js');
  fs.unlink('jquery.ninjaui.js');
});
