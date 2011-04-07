Testing Ninja UI Code
=====================

Ninja UI has two sets of tests, housed in test/index.html.

- The top part of the page includes widgets for manual testing.
- The bottom part of the page contains unit tests that are automatically
  executed against all supported versions of jQuery.

'rake test' loads[1] test/index.html in all available browsers[2].
test/test.automated.js contains all the automated tests used for Ninja UI.

1. The 'rake test' loading might only work on a Mac. If someone confirms
this works on other platforms, or updates the Rakefile to match, we wouldn't
complain.

2. See the Rakefile for what's known so far.
