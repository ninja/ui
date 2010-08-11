require 'ninjaui/version'
require 'sinatra/base'

module Sinatra
  module NinjauiHelpers
    def nui_head(options={:jquery_path => '/ninjaui/javascripts/jquery-1.4.2.min.js', :version => Ninjaui::VERSION})
      "<link href=\"/ninjaui/webjutsu.css?#{options[:version]}\" media=\"all\" rel=\"stylesheet\" type=\"text/css\" />
    <script src=\"#{options[:jquery_path]}\" type=\"text/javascript\"> </script>
    <script src=\"/ninjaui/javascripts/webjutsu.js?#{options[:version]}\" type=\"text/javascript\"> </script>"
    end
  end
  helpers NinjauiHelpers
end
