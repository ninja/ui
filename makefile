# Makefile tasks for Ninja UI

export JQUERY_VERSION := 1.7.1

COLOR_CHECK = \033[92m
COLOR_MESSAGE = \033[32m
COLOR_COMMENT = \033[90m
COLOR_NONE = \033[0m

VERSION = $(shell node --print --eval "require('package.json').version")
COPYRIGHT = "/*! Ninja UI ${VERSION} ninjaui.com | ninjaui.com/\#license */"
SRC_FILE = src/ninjaui.js
DIST_DIR = dist/${VERSION}
DIST_FILE = ${DIST_DIR}/jquery.ninjaui.js
DIST_FILE_MIN = ${DIST_DIR}/jquery.ninjaui.min.js
BAIL = --bail
REPORTER = dot

ninjaui: hint minify test-all

hint:
	@echo "\nChecking syntax\n"
	@node_modules/.bin/jshint ${SRC_FILE} --config src/.jshintrc --show-non-errors
	@make success MESSAGE="check complete" COMMENT=${SRC_FILE}

build:
	@echo "Building Ninja UI ${VERSION}\n"
	@node scripts/build.js
	@make success MESSAGE="build complete" COMMENT=${DIST_FILE}

minify: build
	@echo "Minifying Ninja UI ${VERSION}\n"
	@echo ${COPYRIGHT} > ${DIST_FILE_MIN}
	@node_modules/.bin/uglifyjs --unsafe --no-copyright ${DIST_FILE} >> ${DIST_FILE_MIN}
	@make success MESSAGE="minification complete" COMMENT=${DIST_FILE_MIN}

test:
	@echo "Testing Ninja UI ${VERSION} with jQuery ${JQUERY_VERSION}"
	@node_modules/.bin/mocha --colors --ui bdd --globals $$,expect,version --require ./test --reporter $(REPORTER) $(BAIL)

test-all: test-1.7.1 test-1.7.0

test-1.7.1:
	@make test JQUERY_VERSION=1.7.1

test-1.7.0:
	@make test JQUERY_VERSION=1.7.0

version:
	@echo ${VERSION}

watch:
	@node scripts/watch.js

success:
	@echo "  ${COLOR_CHECK}✔${COLOR_NONE} ${COLOR_MESSAGE}${MESSAGE}${COLOR_NONE} ${COLOR_COMMENT}(${COMMENT})${COLOR_NONE}\n"

.PHONY: default hint build minify test test-all test-1.7.1 test 1.7.0 watch success
