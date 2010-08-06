require 'ninjaui/version'
require 'sinatra/base'

module Sinatra
  module NinjauiHelpers
    def ninjaui
      '<link href="/public/ninjaui/webjutsu.css?' + Ninjaui::VERSION + '" media="all" rel="stylesheet" type="text/css" />' + "\n    " +
      '<script src="/ninjaui/webjutsu.js?' + Ninjaui::VERSION + '" type="text/javascript"> </script>'
    end
  end
  helpers NinjauiHelpers
end