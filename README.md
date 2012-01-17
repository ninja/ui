[Ninja User Interface](http://ninjaui.com/)
=================================================

the jQuery plugin for lethal interaction

Production Dependency
---------------------

[jQuery](http://jquery.com/)

Development Dependencies
------------------------
[Node.js](http://nodejs.org/)
Jake
CleanCSS
UglifyJS

Develop
-------
If you've never previously installed Jake before

    npm install -g jake

Navigate to wherever you cloned/downloaded Ninja UI and install dependencies

    cd ~/projects/ninjaui
    npm install

Test during development
-----------------------
Open test page in a web browser

    file:///~/projects/ninjaui/test/index.html

Build
-----
After making changes to either src/ninjaui.js or src/ninjaui.css run jake

    cd ~/projects/ninjaui
    jake

Test after building
-------------------
Open test page in a web browser

    file:///~/projects/ninjaui/test/index.html?environment=production

Authors
-------

Jamie R. Hoover and Faisal N. Jawdat

License
-------

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
