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
      lib = File.dirname(__FILE__) + '/ninjaui'
      lib_javascripts = "#{lib}/javascripts"
      lib_stylesheets = "#{lib}/stylesheets"

      public = 'public/ninjaui'
      public_images = "#{public}/images"
      public_javascripts = "#{public}/javascripts"
      public_stylesheets = "#{public}/stylesheets"
      public_scss = "#{public}/webjutsu.scss"

      # Remove outdated files
      FileUtils.rm_rf public_images unless !File.exists?(public_images)
      FileUtils.rm_rf public_javascripts unless !File.exists?(public_javascripts)
      FileUtils.rm_rf public_stylesheets unless !File.exists?(public_stylesheets)

      # Create ninjaui directories under public
      FileUtils.mkdir_p public_images
      FileUtils.mkdir_p public_javascripts
      FileUtils.mkdir_p public_stylesheets

      # Copy webjutsu.scss to ninjaui directory to allow user customization
      FileUtils.cp("#{lib_stylesheets}/webjutsu.scss", public_scss) unless File.exist?(public_scss)

      # Compile scss sources to file under assets
      FileUtils.mkdir_p "#{lib}/assets/stylesheets"
      File.open("#{lib}/assets/stylesheets/ninjaui.css", 'w+:UTF-8') do |stylesheet|
        stylesheet.write Sass::Engine.new(
          File.read(public_scss),
          :cache => false,
          :load_paths => [lib_stylesheets],
          :style => :compressed,
          :syntax => :scss
        ).render
      end

      # Compile javascript sources to file under public
      javascript = Sprockets::Secretary.new(
        :asset_root => public,
        :source_files => ["#{lib_javascripts}/jquery.ninjaui.core.js"]
      )
      javascript.concatenation.save_to("#{public_javascripts}/jquery.ninjaui.js")

      # Copy compiled css and images from assets to public
      javascript.install_assets

      puts "Ninja ui can be found here: #{public}"

    end

  end

end
