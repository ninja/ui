# -*- encoding: utf-8 -*-
lib = File.expand_path('../lib/', __FILE__)
$:.unshift lib unless $:.include?(lib)

Gem::Specification.new do |s|
  s.name = 'ninjaui'
  s.version = '1.0.beta'
  s.summary = 'Ninja UI'
  s.description = 'Ninja user interface - JavaScript and CSS webjutsu'
  s.homepage = 'http://ninjaui.com'
  s.email = 'ninjaui@me.com'

  s.authors = ['Jamie Hoover', 'Faisal N. Jawdat']

  s.platform = Gem::Platform::RUBY
  s.required_rubygems_version = '>= 1.3.6'

  s.files = `git ls-files`.split("\n")
  s.test_files = `git ls-files -- {test, spec}/*`.split("\n")
  s.require_path = 'lib'
  s.bindir = 'bin'
  s.executables = 'ninjaui'
end
