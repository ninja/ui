#!/usr/bin/env ruby
# encoding: UTF-8

require 'fileutils'
require 'pathname'
require 'closure-compiler'
require 'sass'
require 'sprockets'

module Ninjaui
  
  gemspec = Gem.loaded_specs['ninjaui']
  AUTHOR = gemspec.author
  DESCRIPTION = gemspec.description
  SUMMARY = gemspec.summary
  VERSION = gemspec.version

  class << self

    def application
      @application ||= Ninjaui::Application.new
    end

  end

  class Application

    def install
      publicImages = publicRoot + 'images'
      publicJavaScripts = publicRoot + 'javascripts'
      publicStyleSheets = publicRoot + 'stylesheets'

      # Remove outdated files
      FileUtils.rm_rf publicImages unless !File.exists?(publicImages)
      FileUtils.rm_rf publicJavaScripts unless !File.exists?(publicJavaScripts)
      FileUtils.rm_rf publicStyleSheets unless !File.exists?(publicStyleSheets)

      # Create directories under public
      FileUtils.mkdir_p publicImages
      FileUtils.mkdir_p publicJavaScripts
      FileUtils.mkdir_p publicStyleSheets

      # Compile SCSS sources to file under assets
      Sass.compile_file(
        "#{privateRoot}/stylesheets/core.scss",
        "#{publicStyleSheets}/ninjaui.css",
        :cache => false,
        :style => :compressed
      )
      
      # Concatentate JavaScript sources to file under public
      javaScriptSource = privateRoot + 'javascripts/jquery.ninjaui.core.js'
      javaScriptConcatentated = publicJavaScripts + 'jquery.ninjaui.js'
      javaScriptCompressed = publicJavaScripts + 'jquery.ninjaui.min.js'
      sprocket = Sprockets::Secretary.new(
        :asset_root => publicRoot.to_s,
        :source_files => [javaScriptSource.to_s],
        :strip_comments => false
      )
      sprocket.concatenation.save_to(javaScriptConcatentated.to_s)
      
      # Copy images and javascripts from assets to public
      sprocket.install_assets

      # Compile public JavaScript file
      closure = Closure::Compiler.new.compile(File.open(javaScriptConcatentated, 'r'))
      File.open(javaScriptCompressed, 'w') {|f| f.write(closure)}

      puts "Ninja ui can be found here: #{publicRoot}"

    end
    
    private
    
    def privateRoot
      Pathname.new(__FILE__).parent + 'ninjaui'
    end
    
    def publicRoot
      Pathname.new "#{ARGV[0] ||= 'public'}/ninjaui"
    end
    
  end

end
