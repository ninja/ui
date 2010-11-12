# -*- encoding: utf-8 -*-
lib = File.expand_path('../lib/', __FILE__)
$:.unshift lib unless $:.include?(lib)

Gem::Specification.new do |s|
  s.platform = Gem::Platform::RUBY
  s.name = 'ninjaui'
  s.version = '0.9.9.9'
  s.summary = 'Ninja ui'
  s.description = 'Ninja user interface is skilled in the techniques of JavaScript and CSS, going unnoticed until called upon to perform the arts of webjutsu.'

  s.required_ruby_version = '>= 1.8.7'
  s.required_rubygems_version = '>= 1.3.6'

  s.author = 'Jamie Hoover'
  s.email = 'dont.tase@me.com'
  s.homepage = 'http://ninjaui.com'
  s.rubyforge_project = 'ninjaui'

  s.files = Dir.glob("{bin,lib}/**/*") + %w(readme.rdoc license.rdoc)
  s.require_path = 'lib'
  s.bindir = 'bin'
  s.executables = 'ninjaui'
  s.default_executable = 'ninjaui'

  s.add_dependency 'closure-compiler', '>= 0.3.3'
  s.add_dependency 'sass', '>= 3.1.0.alpha.28'
  s.add_dependency 'sprockets', '>= 1.0.2'
end
