# Makefile tasks for Ninja UI

export JQUERY_VERSION := 1.7.2

VERSION = $(shell node --print --eval "require('package.json').version")
COPYRIGHT = "/*! Ninja UI ${VERSION} ninjaui.com | ninjaui.com/\#license */"

SRC_FILE = src/ninjaui.js
DIST_DIR = dist/${VERSION}
DIST_FILE = ${DIST_DIR}/jquery.ninjaui.js
DIST_FILE_MIN = ${DIST_DIR}/jquery.ninjaui.min.js

BAIL = --bail
REPORTER = dot

COLOR_CHECK = \033[92m
COLOR_MESSAGE = \033[32m
COLOR_COMMENT = \033[90m
COLOR_NONE = \033[0m

build: build-css build-js test

build-css:
	@echo "Building Ninja CSS...\n"
	@mkdir -p ${DIST_DIR}
	@node_modules/.bin/stylus lib/ninja.styl --use node_modules/nib/lib/nib --out ${DIST_DIR} --compress
	@make success MESSAGE="...Ninja CSS built." COMMENT=${DIST_DIR}/ninja.css

build-js:
	@echo "Checking Ninja JavaScript syntax...\n"
	@node_modules/.bin/jshint ${SRC_FILE} --config src/.jshintrc --show-non-errors
	@make success MESSAGE="...Ninja JavaScript syntax looks good." COMMENT=${SRC_FILE}
	@echo "Building Ninja JavaScript...\n"
	@node scripts/build.js
	@make success MESSAGE="...Ninja JavaScript built." COMMENT=${DIST_FILE}
	@echo "Minifying Ninja JavaScript...\n"
	@echo ${COPYRIGHT} > ${DIST_FILE_MIN}
	@node_modules/.bin/uglifyjs --unsafe --no-copyright ${DIST_FILE} >> ${DIST_FILE_MIN}
	@make success MESSAGE="...Ninja JavaScript minified." COMMENT=${DIST_FILE_MIN}

test: test-js-1.7.2 test-js-1.7.1 test-js-1.7

test-css:
	@echo "Testing Ninja CSS ${VERSION}"
	@open test/index.html

test-js:
	@echo "Testing Ninja UI ${VERSION} with jQuery ${JQUERY_VERSION}"
	@node_modules/.bin/mocha --colors --ui bdd --globals $$,expect,version --require ./test --reporter $(REPORTER) $(BAIL)

test-js-1.7:
	@make test-js JQUERY_VERSION=1.7

test-js-1.7.1:
	@make test-js JQUERY_VERSION=1.7.1

test-js-1.7.2:
	@make test-js JQUERY_VERSION=1.7.2

version:
	@echo ${VERSION}

watch:
	@node scripts/watch.js

watch-css:
	@echo "Watching Ninja CSS ${VERSION}\n"
	@mkdir -p ${DIST_DIR}
	@node_modules/.bin/stylus lib/ninja.styl --watch --use node_modules/nib/lib/nib --out ${DIST_DIR}

success:
	@echo "  ${COLOR_CHECK}✔${COLOR_NONE} ${COLOR_MESSAGE}${MESSAGE}${COLOR_NONE} ${COLOR_COMMENT}(${COMMENT})${COLOR_NONE}\n"

.PHONY: build build-css minify test test-css test-js test-js-1.7 test-js-1.7.1 test-js-1.7.2 success watch watch-css watch-js
