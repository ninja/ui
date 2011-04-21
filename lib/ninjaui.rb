#!/usr/bin/env ruby

=begin
  Copyright 2010 Jamie Hoover
=end

require 'fileutils'

module Ninja
  gemspec = Gem.loaded_specs['ninjaui']
  NAME = gemspec.name.to_s
  VERSION = gemspec.version.to_s
  SUMMARY = gemspec.summary.to_s

  class << self
    def ui
      @ui ||= Ninja::UI.new
    end
  end

  class UI
    def install
      origin = "#{FileUtils.pwd}/lib"
      destination = "#{ARGV[0] ||= 'public'}/#{NAME}-#{VERSION}"

      # Remove outdated files
      FileUtils.rm_rf destination

      # Copy new files
      FileUtils.mkdir_p destination + '/fonts'
      FileUtils.mkdir_p destination + '/images'
      FileUtils.mkdir_p destination + '/stylesheets'
      FileUtils.cp_r origin + '/fonts', destination
      FileUtils.cp_r origin + '/images', destination
      FileUtils.cp_r origin + '/stylesheets', destination
      FileUtils.cp origin + '/jquery.ninja.ui.js', destination

      # Add version number to function inside jQuery plugin
      rawFile = destination + '/jquery.ninja.ui.js'
      versionedFile = File.read(rawFile).gsub(/VERSION/, VERSION)
      File.open(rawFile, 'w') {|file|
        file.puts versionedFile
      }

      puts "#{SUMMARY} installed here: #{destination}"
    end
  end

end