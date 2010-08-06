# -*- encoding: utf-8 -*-
lib = File.expand_path('../lib/', __FILE__)
$:.unshift lib unless $:.include?(lib)

require 'ninjaui/version'

Gem::Specification.new do |s|
  s.name = 'ninjaui'
  s.version = Ninjaui::VERSION
  s.platform = Gem::Platform::RUBY
  s.authors = ['Jamie Hoover']
  s.email = 'dont.tase@me.com'
  s.homepage = 'http://ninjaui.com'
  s.summary = 'Ninja user interface'
  s.description = 'Ninja user interface is skilled in the techniques of JavaScript and CSS, going unnoticed until called upon to perform the arts of webjutsu.'
  s.required_rubygems_version = '>= 1.3.6'
  s.rubyforge_project = 'ninjaui'
  s.add_dependency 'sprockets'
  s.add_dependency 'haml'
  s.files = Dir.glob("{bin,lib}/**/*") + %w(readme license)
  s.require_path = 'lib'
  s.bindir = 'bin'
  s.executables = 'ninjaui'
  s.default_executable = 'ninjaui'
end
