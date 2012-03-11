BAIL = --bail
REPORTER = dot

default:
	$(MAKE) -s build test-all

build:
	node scripts/build.js

test:
	./node_modules/.bin/mocha --ui bdd --require ./test/lib --reporter $(REPORTER) $(BAIL)

test-all: test-1.7.1 test-1.7.0 test-1.6.4 test-1.6.3 test-1.6.2 test-1.6.1 test-1.6.0

test-1.7.1:
	$(MAKE) -s JQUERY_VERSION=1.7.1 test

test-1.7.0:
	$(MAKE) -s JQUERY_VERSION=1.7.0 test

test-1.6.4:
	$(MAKE) -s JQUERY_VERSION=1.6.4 test

test-1.6.3:
	$(MAKE) -s JQUERY_VERSION=1.6.3 test

test-1.6.2:
	$(MAKE) -s JQUERY_VERSION=1.6.2 test

test-1.6.1:
	$(MAKE) -s JQUERY_VERSION=1.6.1 test

test-1.6.0:
	$(MAKE) -s JQUERY_VERSION=1.6.0 test

.PHONY: test
