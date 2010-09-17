#!/usr/bin/env ruby -w
# encoding: UTF-8

require 'fileutils'
require 'pathname'
require 'sass'
require 'sprockets'

module Ninjaui

  AUTHOR = 'Jamie Hoover'
  DESCRIPTION = 'Ninja user interface is skilled in the techniques of JavaScript and CSS, going unnoticed until called upon to perform the arts of webjutsu.'
  VERSION = '0.9.9.2' unless defined?(::Ninjaui::VERSION)

  class << self

    def application
      @application ||= Ninjaui::Application.new
    end

  end

  class Application

    def install
      public_images = public_root + 'images'
      public_javascripts = public_root + 'javascripts'
      public_stylesheets = public_root + 'stylesheets'

      # Remove outdated files
      FileUtils.rm_rf public_images unless !File.exists?(public_images)
      FileUtils.rm_rf public_javascripts unless !File.exists?(public_javascripts)
      FileUtils.rm_rf public_stylesheets unless !File.exists?(public_stylesheets)

      # Create directories under public
      FileUtils.mkdir_p public_images
      FileUtils.mkdir_p public_javascripts
      FileUtils.mkdir_p public_stylesheets

      # Copy webjutsu.scss to public directory to allow user customization
      private_webjutsu = private_root + 'stylesheets/webjutsu.scss'
      public_webjutsu = public_root + 'webjutsu.scss'
      FileUtils.cp(private_webjutsu, public_webjutsu) unless File.exist?(public_webjutsu)

      # Compile SCSS sources to file under assets
      File.open(public_stylesheets + 'ninjaui.css', 'w+:UTF-8') do |stylesheet|
        stylesheet.write Sass::Engine.new(
          File.read(public_webjutsu),
          :cache => false,
          :load_paths => [private_root + 'stylesheets'],
          :style => :compressed,
          :syntax => :scss
        ).render
      end

      # Compile JavaScript sources to file under public
      private_javascript = private_root + 'javascripts/jquery.ninjaui.core.js'
      public_javascript = public_javascripts + 'jquery.ninjaui.js'
      javascript = Sprockets::Secretary.new(
        :asset_root => public_root.to_s,
        :source_files => [private_javascript.to_s]
      )
      javascript.concatenation.save_to(public_javascript.to_s)

      # Copy compiled CSS and images from assets to public
      javascript.install_assets

      puts "Ninja ui can be found here: #{public_root}"

    end
    
    private
    
    def private_root
      Pathname.new(__FILE__).parent + 'ninjaui'
    end
    
    def public_root
      Pathname.new "#{ARGV[0] ||= 'public'}/ninjaui"
    end
    
  end

end
