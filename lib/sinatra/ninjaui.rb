require 'ninjaui/version'
require 'sinatra/base'

module Sinatra
  module NinjauiHelpers
    def nui_head(options={:jquery_path => '/ninjaui/javascripts/jquery-1.4.2.min.js', :version => Ninjaui::VERSION})
      "<link href=\"/ninjaui/stylesheets/ninjaui.css?#{options[:version]}\" media=\"all\" rel=\"stylesheet\" type=\"text/css\" />
    <script src=\"#{options[:jquery_path]}\" type=\"text/javascript\"> </script>
    <script src=\"/ninjaui/javascripts/jquery.ninjaui.js?#{options[:version]}\" type=\"text/javascript\"> </script>"
    end
  end
  helpers NinjauiHelpers
end
