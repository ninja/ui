##[Ninja User Interface](http://ninjaui.com/)
*the jQuery plugin for lethal interaction*

###Extends [jQuery](http://jquery.com/)
versions 1.6 - 1.7.1

###Develop with [Node.js](http://nodejs.org/)

1.) Install node and npm.

*Here's how with [homebrew](http://mxcl.github.com/homebrew/) in Mac OS X:*

    brew install node
    curl http://npmjs.org/install.sh | sh

2.) [`Fork`](fork_select) Ninja UI.

3.) Clone from your fork.

    mkdir ~/ninja
    git clone git@github.com:<GITHUB_USER_NAME>/ui.git ~/Code/ninja/ui

4.) Install development dependencies:

    cd ~/ninja/ui
    npm install -d

Build and test latest development version:

    npm run-script build
    
Test without building:

    npm test

**Automatically** watch and rebuild/retest when source/tests change:

    npm run-script watch

###Authors
[`uipoet`](/uipoet "Jamie Hoover") and [`faisal`](/faisal "Faisal N. Jawdat")

###License
Copyright 2008-2012 Jamie Hoover.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.

You may obtain a copy of the License at

[ninjaui.com/LICENSE.txt](http://ninjaui.com/LICENSE.txt)

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
