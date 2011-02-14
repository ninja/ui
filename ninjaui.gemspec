# -*- encoding: utf-8 -*-
lib = File.expand_path('../lib/', __FILE__)
$:.unshift lib unless $:.include?(lib)

Gem::Specification.new do |s|
  s.platform = Gem::Platform::RUBY
  s.name = 'ninjaui'
  s.version = '1.0.alpha.1'
  s.summary = 'Ninja ui'
  s.description = 'Ninja user interface - JavaScript and CSS webjutsu'

  s.required_ruby_version = '>= 1.9.2'
  s.required_rubygems_version = '>= 1.3.7'

  s.author = 'Jamie Hoover'
  s.email = 'dont.tase@me.com'
  s.homepage = 'http://ninjaui.com'
  s.rubyforge_project = 'ninjaui'

  s.files = Dir.glob("{bin,lib}/**/*") + %w(readme.rdoc)
  s.require_path = 'lib'
  s.bindir = 'bin'
  s.executables = 'ninjaui'
  s.default_executable = 'ninjaui'

  s.add_dependency 'closure-compiler', '>= 0.3.3'
end
