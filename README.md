#[Ninja User Interface](http://ninjaui.com/)
the jQuery plugin for lethal interaction

##Depends On [jQuery](http://jquery.com/)
versions 1.6 - 1.7.1

##Develop with [Node.js](http://nodejs.org/)

###Install Git, Node.js, NPM and Jake
	brew install git node
	curl http://npmjs.org/install.sh | sh
	npm install -g jake

###Fork, Clone and install dependencies of  Ninja UI
	mkdir ~/Code/ninja
	git clone git@github.com:GITHUB_USER_NAME/ui.git ~/Code/ninja/ui
	cd ~/Code/ninja/ui
	npm install -d

###Build latest development version
	cd ~/Code/ninja/ui
    jake

###Watch and automatically build
	cd ~/Code/ninja/ui
    jake watch

##Authors
Jamie R. Hoover and Faisal N. Jawdat

##License
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
