# -*- encoding: utf-8 -*-
lib = File.expand_path('../lib/', __FILE__)
$:.unshift lib unless $:.include?(lib)

require 'ninjaui'

Gem::Specification.new do |s|
  s.name = 'ninjaui'
  s.version = Ninjaui::VERSION
  s.platform = Gem::Platform::RUBY
  s.authors = [Ninjaui::AUTHOR]
  s.email = 'dont.tase@me.com'
  s.homepage = 'http://ninjaui.com'
  s.summary = 'Ninja ui'
  s.description = Ninjaui::DESCRIPTION
  s.required_rubygems_version = '>= 1.3.6'
  s.rubyforge_project = 'ninjaui'
  s.add_dependency 'haml'
  s.add_dependency 'sprockets'
  s.files = Dir.glob("{bin,lib}/**/*") + %w(readme.rdoc license.rdoc)
  s.require_path = 'lib'
  s.bindir = 'bin'
  s.executables = 'ninjaui'
  s.default_executable = 'ninjaui'
end
