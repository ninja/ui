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

      # Create ninjaui directory under public
      public = 'public/ninjaui'
      FileUtils.mkdir_p "#{public}/images"
      FileUtils.mkdir_p "#{public}/javascripts"
      FileUtils.mkdir_p "#{public}/stylesheets"

      # Copy ninjaui.scss to ninjaui directory to allow user customization
      lib_stylesheets = "#{lib}/stylesheets"
      public_scss = "#{public}/ninjaui.scss"
      FileUtils.cp("#{lib_stylesheets}/ninjaui.scss", public_scss) unless File.exist?(public_scss)

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
      lib_javascripts = "#{lib}/javascripts"
      public_javascripts = "#{public}/javascripts"
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
