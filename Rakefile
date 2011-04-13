require 'bundler'

begin
  Bundler.setup
rescue => exception
  puts exception.to_s
  puts "To install missing gems, run:"
  puts "  $ bundle install"
  exit
end

@all_browsers = ['Google Chrome', 'Safari', 'Firefox', 'Minefield', 'Camino', 'Internet Explorer']
@url = 'http://0.0.0.0:4000/test/?noglobals=true'

def prefered_browser
  @prefered_browser ||= (ENV['NINJA_BROWSER'] or @all_browsers.detect {|browser| system("open -a '#{browser}' 2>/dev/null")})
end

def open_url(url, browser=nil)
  Thread.new do
    sleep 3
    open_cmd = 'open '
    open_cmd += "-a '#{browser.to_s}' " if browser
    open_cmd += "'#{url}'"
    system open_cmd
  end
end

def launch_server
  puts 'Launching web server.'
  system 'serve'
end

namespace :test do
  task :all do
    @all_browsers.each do |browser|
      open_url @url, browser
    end
    launch_server
  end

  task :main do
    open_url @url, prefered_browser
    launch_server
  end

  task :default do
    open_url @url
    launch_server
  end

  task :file do
    puts
    puts "'rake test:file' IS DEPRECATED."
    puts
    puts "Various features do not work on various browsers if you load locally."
    puts
    puts "Wouldn't you rather test with a server?"
    puts
    puts "    $ rake test"
    puts
    open_url 'test/index.html'
  end

end

task :test do
  Rake::Task['test:all'].invoke
end

task :tasks do
  puts 'rake test:all        # open test page in all findable browsers'
  puts 'rake test:main       # open test page to main browser'
  puts '                     #   set NINJA_BROWSER to specify, or Ninja UI will guess'
  puts 'rake test:default    # open test page in your default browsr'
  puts 'rake test            # an alias for rake test:all'
end

task :default => :test
