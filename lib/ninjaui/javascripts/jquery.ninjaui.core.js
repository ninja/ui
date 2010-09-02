/* Ninja ui
 * Dependencies in order:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *	jquery.ui.mouse.js
 *	jquery.ui.position.js
 *	jquery.ui.draggable.js
 */
//= require "modernizr"
//= require "jquery.ui.core"
//= require "jquery.ui.widget"
//= require "jquery.ui.mouse"
//= require "jquery.ui.position"
//= require "jquery.ui.draggable"
//= provide "../assets"
(function($){
  var config = {};
  var global = {
    selected:'',
    selector:''
  };
  var init = $.prototype.init;
  $.prototype.init = function(selector, context){
    var r = init.apply(this, arguments);
    if(selector && selector.selector){
      r.context = selector.context;
      r.selector = selector.selector;
    }
    if(typeof selector == 'string'){
      r.context = context || document;
      r.selector = selector;
      global.selector = r.selector;
    }
    global.selected = r;
    return r;
  };
  $.prototype.init.prototype = $.prototype;
  $.fn.ninjaui = {
    config:function(args){
      setConfig($.extend({
        'default':'value'
      }, args));
      return(getConfig());
    }
  };
  function setConfig(value){
    config = value;
  }
  function getConfig(){
    return config;
  }
  $.ninjaui = {};
//= require "jquery.ninjaui.button"
//= require "jquery.ninjaui.drawers"
//= require "jquery.ninjaui.filmstrip"
//= require "jquery.ninjaui.folders"
//= require "jquery.ninjaui.menu"
//= require "jquery.ninjaui.rating"
//= require "jquery.ninjaui.slider"
//= require "jquery.ninjaui.wait"
//= require "jquery.ninjaui.window"
})(jQuery);
