[Ninja UI](http://ninjaui.com/) - jQuery Webjutsu
=================================================

jQuery plugin enabling you to create beautiful web interface objects efficiently and unobtrusively.

Dependencies
------------

[jQuery](http://jquery.com/)

[Node.js](http://nodejs.org/) (Only for development)

Develop
-------
Navigate to wherever you cloned/downloaded Ninja UI and npm link

    cd ~/projects/ninjaui
    npm link

Test during development
-----------------------
Open test page in a web browser

    file:///~/projects/ninjaui/test/index.html

Build
-----
After making changes to either src/ninjaui.js or src/ninjaui.css run ninjabuild

    cd ~/projects/ninjaui
    ninjabuild

Test after building
-------------------
Open test page in a web browser

    file:///~/projects/ninjaui/test/index.html?environment=production

Authors
-------

Jamie Hoover and Faisal N. Jawdat

License
-------

Copyright 2008-2011 Jamie Hoover.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.

You may obtain a copy of the License at

[ninjaui.com/LICENSE](http://ninjaui.com/LICENSE)

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
