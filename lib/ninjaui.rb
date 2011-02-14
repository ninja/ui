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
      origin = "#{FileUtils.pwd}/lib/#{NAME}"
      destination = "#{ARGV[0] ||= 'public'}/#{NAME}"

      # Remove outdated files
      FileUtils.rm_rf destination# unless !File.exists?(destination)

      # Copy new files
      FileUtils.cp_r origin, destination

      # Compile JavaScript file
      File.open(destination + '/jquery.' + NAME + '-' + VERSION + '.min.js', 'w') {|f|
        f.write(Closure::Compiler.new.compile(
          File.open(origin + '/jquery.' + NAME + '-' + VERSION + '.js', 'r')
        ))
      }

      puts "#{SUMMARY} installed here: #{destination}"
    end

  end

end