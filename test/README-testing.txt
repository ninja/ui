# TESTING  NINJA UI  CODE

Ninja UI has two sets of tests:

- test/index.html includes widges for manual testing, and links to automated
  testing on multiple jQuery versions.
- test/qunit/tests.js contains automated unit tests that are loaded into the
  automated testing harnesses html files in test/qunit.

'rake test' loads[1] all of these tests in all available browsers. The
automated tests load the appropriate version of jQuery and then load the
test/qunit/tests.js file, allowing regression across all supported jQuery
versions. tests.js contains all the automated tests used for Ninja UI.

[1] The 'rake test' loading might only work on a Mac. If someone confirms
this works on other platforms, or updates the Rakefile to match, we wouldn't
complain.

[2] See the Rakefile for what's known so far.
