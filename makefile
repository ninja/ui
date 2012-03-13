BAIL = --bail
REPORTER = dot

default: build test-all

version:
	@node scripts/version.js

lint:
	@echo "\nLinting Ninja UI `make version`"
	@./node_modules/.bin/jshint src/ninjaui.js --config src/.jshintrc --show-non-errors

build: lint
	@node scripts/build.js

watch:
	@node scripts/watch.js

test:
	@./node_modules/.bin/mocha --colors --ui bdd --require ./test/lib --reporter $(REPORTER) $(BAIL)

test-all: test-1.7.1 test-1.7.0 test-1.6.4 test-1.6.3 test-1.6.2 test-1.6.1 test-1.6.0

test-1.7.1:
	@make test JQUERY_VERSION=1.7.1

test-1.7.0:
	@make test JQUERY_VERSION=1.7.0

test-1.6.4:
	@make test JQUERY_VERSION=1.6.4

test-1.6.3:
	@make test JQUERY_VERSION=1.6.3

test-1.6.2:
	@make test JQUERY_VERSION=1.6.2

test-1.6.1:
	@make test JQUERY_VERSION=1.6.1

test-1.6.0:
	@make test JQUERY_VERSION=1.6.0

.PHONY: default build watch test test-all test-1.7.1 test 1.7.0 test-1.6.4 test-1.6.3 test-1.6.2 test-1.6.1 test-1.6.0
