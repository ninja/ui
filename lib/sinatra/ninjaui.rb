require 'ninjaui/version'
require 'pathname'
require 'erubis'
require 'sinatra/base'

module Sinatra
  module NinjauiHelpers
    
    def nui(template)
      @version = Ninjaui::VERSION
      erubis(:"#{path_partial(template)}", :layout => false, :views => private_views)
    end
    
    def partial(template)
      erubis(:"#{path_partial(template)}", :layout => false)
    end
    
    private
    
    def path_partial(template)
      path = Pathname.new(template.to_s)
      path.dirname.to_s + '/_' + path.basename.to_s
    end
    
    def private_views
      Pathname.new(__FILE__).parent + 'views'
    end
    
  end
  helpers NinjauiHelpers
end
