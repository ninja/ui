# Makefile tasks for Ninja UI

export JQUERY_VERSION := 1.7.1

VERSION = $(shell node --print --eval "require('package.json').version")
COPYRIGHT = "/*! Ninja UI ${VERSION} ninjaui.com | ninjaui.com/\#license */"
DIST_DIR = ./dist/${VERSION}
DIST_FILE = ${DIST_DIR}/jquery.ninjaui.min.js
BAIL = --bail
REPORTER = dot

ninjaui: minify test-all

version:
	@echo ${VERSION}

hint:
	@echo "\nChecking for syntax errors..."
	@./node_modules/.bin/jshint src/ninjaui.js --config src/.jshintrc --show-non-errors
	@echo "\n...looking good, feeling good."

build: hint
	@node scripts/build.js

minify: build
	@echo ${COPYRIGHT} > ${DIST_FILE}
	@./node_modules/.bin/uglifyjs --unsafe --no-copyright ${DIST_DIR}/jquery.ninjaui.js >> ${DIST_FILE}

test:
	@echo "Testing Ninja UI ${VERSION} with jQuery ${JQUERY_VERSION}"
	@./node_modules/.bin/mocha --colors --ui bdd --globals $$,expect,version --require ./test --reporter $(REPORTER) $(BAIL)

test-all: test-1.7.1 test-1.7.0

test-1.7.1:
	@make test JQUERY_VERSION=1.7.1

test-1.7.0:
	@make test JQUERY_VERSION=1.7.0

watch:
	@node scripts/watch.js

.PHONY: default hint build minify test test-all test-1.7.1 test 1.7.0 watch
