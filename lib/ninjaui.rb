#!/usr/bin/env ruby
# encoding: UTF-8

require 'fileutils'
require 'closure-compiler'

module Ninjaui
  gemspec = Gem.loaded_specs['ninjaui']
  NAME = gemspec.name.to_s
  VERSION = gemspec.version.to_s
  SUMMARY = gemspec.summary.to_s

  class << self
    def application
      @application ||= Ninjaui::Application.new
    end
  end

  class Application
    def install
      origin = "#{FileUtils.pwd}/lib"
      destination = "#{ARGV[0] ||= 'public'}/#{NAME}"

      # Remove outdated files
      FileUtils.rm_rf destination

      # Copy new files
      FileUtils.mkdir_p destination + '/images'
      FileUtils.cp_r origin + '/images', destination
      FileUtils.cp origin + '/jquery.' + NAME + '.js', destination + '/jquery.' + NAME + '-' + VERSION + '.js'
      FileUtils.cp origin + '/' + NAME + '.css', destination + '/' + NAME + '-' + VERSION + '.css'

      # Compile JavaScript file
      File.open(destination + '/jquery.' + NAME + '-' + VERSION + '.min.js', 'w') {|f|
        f.write(Closure::Compiler.new.compile(
          File.open(origin + '/jquery.' + NAME + '.js', 'r')
        ))
      }

      puts "#{SUMMARY} installed here: #{destination}"
    end
  end

end