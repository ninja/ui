require 'ninjaui/version'
require 'erubis'
require 'sinatra/base'

module Sinatra
  module NinjauiHelpers
    def nui(template)
      @version = Ninjaui::VERSION
      template_array = template.to_s.split('/')
      template = template_array[0..-2].join('/') + "/_#{template_array[-1]}"
      erubis(:"#{template}", :layout => false, :views => "#{File.dirname(__FILE__)}/views")
    end
    def partial(template)
      template_array = template.to_s.split('/')
      template = template_array[0..-2].join('/') + "/_#{template_array[-1]}"
      erubis(:"#{template}", :layout => false)
    end
  end
  helpers NinjauiHelpers
end
