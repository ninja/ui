#!/usr/bin/env ruby

require 'fileutils'

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
      FileUtils.mkdir_p destination + '/themes'
      FileUtils.cp_r origin + '/images', destination
      FileUtils.cp_r origin + '/themes', destination
      FileUtils.cp origin + '/jquery.' + NAME + '.js', destination + '/jquery.' + NAME + '-' + VERSION + '.js'
      FileUtils.cp origin + '/' + NAME + '.css', destination + '/' + NAME + '-' + VERSION + '.css'

      puts "#{SUMMARY} installed here: #{destination}"
    end
  end

end