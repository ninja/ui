#!/usr/bin/env ruby -w
# encoding: UTF-8

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

      # Create clean ninjaui directory under public
      path_assets = 'public/ninjaui'
      Dir.rmdir path_assets if !File.exists?(path_assets)
      Dir.mkdir path_assets

      # Compile scss sources to file under assets
      path_stylesheet = "#{path_source}/stylesheets"
      File.open("#{path_source}/assets/webjutsu.css", 'w+:UTF-8') do |stylesheet|
        stylesheet.write Sass::Engine.new(
          File.read("#{path_stylesheet}/webjutsu.scss"),
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
      javascript.concatenation.save_to("#{path_assets}/webjutsu.js")

      # Copy compiled css and images from assets to public
      javascript.install_assets

      puts "Ninja ui can be found here: #{path_assets}"

    end

  end

end
