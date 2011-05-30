Testing Ninja UI Code
=====================

Ninja UI has two sets of tests, which are most easily used with the rake command:

    rake test:all   # runs the server and tests with any browsers
    rake test:main  # runs the server and tests with the first browser it can
                    # find, or whatever the user specified in NINJA_BROWSER
                    #   e.g.:
                    # $ NINJA_BROWSER='Minefield' rake test:main
    rake            # alias for 'rake test:all'

- The top part of the page includes widgets for manual testing.
- The bottom part of the page contains unit tests that are automatically
  executed against all supported versions of jQuery.

Notes:

1. The 'rake test' loading might only work on a Mac. If someone confirms
this works on other platforms, or updates the Rakefile to match, we wouldn't
complain.

2. See the Rakefile for what's known so far.
