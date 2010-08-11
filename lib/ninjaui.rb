#!/usr/bin/env ruby -w
# encoding: UTF-8

require 'fileutils'
require 'sass'
require 'sprockets'

module Ninjaui

  class << self

    def application
      @application ||= Ninjaui::Application.new
    end

  end

  class Application

    def install
      path_source = File.dirname(__FILE__) + '/ninjaui'

      # Create ninjaui directory under public
      path_assets = 'public/ninjaui'
      FileUtils.mkdir_p "#{path_assets}/images"
      FileUtils.mkdir_p "#{path_assets}/javascripts"
      FileUtils.mkdir_p "#{path_assets}/stylesheets"

      # Copy webjutsu.scss to ninjaui directory to allow user customization
      path_stylesheet = "#{path_source}/stylesheets"
      FileUtils.cp("#{path_stylesheet}/webjutsu.scss", "#{path_assets}/webjutsu.scss") unless File.exist?("#{path_assets}/webjutsu.scss")

      # Compile scss sources to file under assets
      FileUtils.mkdir_p "#{path_source}/assets/stylesheets"
      File.open("#{path_source}/assets/stylesheets/webjutsu.css", 'w+:UTF-8') do |stylesheet|
        stylesheet.write Sass::Engine.new(
          File.read("#{path_assets}/webjutsu.scss"),
          :cache => false,
          :load_paths => [path_stylesheet],
          :style => :compressed,
          :syntax => :scss
        ).render
      end

      # Compile javascript sources to file under public
      javascript = Sprockets::Secretary.new(
        :asset_root => path_assets,
        :source_files => ["#{path_source}/javascripts/webjutsu.js"]
      )
      javascript.concatenation.save_to("#{path_assets}/javascripts/webjutsu.js")

      # Copy compiled css and images from assets to public
      javascript.install_assets

      puts "Ninja ui can be found here: #{path_assets}"

    end

  end

end
