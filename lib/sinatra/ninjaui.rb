require 'erubis'
require 'ninjaui/version'
require 'pathname'
require 'sinatra/base'

module Sinatra
  module Helpers::Ninjaui
    def partial(template, options = {})
      options.merge!(:layout => false)
      path = Pathname.new(template.to_s)
      template = path.dirname.to_s + '/_' + path.basename.to_s
      erubis(template.to_sym, options)
    end
    def ninjaui(template, locals = {})
      @version = ::Ninjaui::VERSION
      options = {:layout => false, :locals => locals, :views => Pathname.new(__FILE__).parent + 'views'}
      erubis(template.to_sym, options)
    end
  end
  helpers Helpers::Ninjaui
end
