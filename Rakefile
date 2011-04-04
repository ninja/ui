task :test do
  ['Safari', 'Firefox', 'Google Chrome'].each do |browser|
    system("open -a '#{browser}' test/index.html test/qunit/*.html");
  end
end
