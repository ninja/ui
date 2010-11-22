/**
 * @license Ninja ui JavaScript/CSS Library v0.9.9.9
 * http://ninjaui.com/
 * Copyright 2010, Jamie Hoover
 * Includes jQuery UI draggable and position components
 * http://jqueryui.com/
 */
//= provide "../assets"
(function($){
  // jQuery UI components
  if(!$.ui || !$.ui.core || $.ui.version !='1.8.6'){
    //= require "jquery.ui.core"
  }
  if(!$.ui || !$.ui.widget || $.ui.version !='1.8.6'){
    //= require "jquery.ui.widget"
  }
  if(!$.ui || !$.ui.mouse || $.ui.version !='1.8.6'){
    //= require "jquery.ui.mouse"
  }
  if(!$.ui || !$.ui.position || $.ui.version !='1.8.6'){
    //= require "jquery.ui.position"
  }
  if(!$.ui || !$.ui.draggable || $.ui.version !='1.8.6'){
    //= require "jquery.ui.draggable"
  }
  //= require "jquery.ninjaui.button"
  //= require "jquery.ninjaui.colors"
  //= require "jquery.ninjaui.drawers"
  //= require "jquery.ninjaui.filmstrip"
  //= require "jquery.ninjaui.folders"
  //= require "jquery.ninjaui.icon"
  //= require "jquery.ninjaui.menu"
  //= require "jquery.ninjaui.message"
  //= require "jquery.ninjaui.navigation"
  //= require "jquery.ninjaui.panel"
  //= require "jquery.ninjaui.radius"
  //= require "jquery.ninjaui.rating"
  //= require "jquery.ninjaui.slider"
  //= require "jquery.ninjaui.tabs"
  //= require "jquery.ninjaui.wait"
  //= require "jquery.ninjaui.window"
})(jQuery);
