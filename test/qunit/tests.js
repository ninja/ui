$(document).ready(function(){
  module("Global tests.");
  test("Test something global", function() {
    ok( true, "That worked." );
  });
  test("But this one should fail", function() {
    ok( false, "Did that work?" );
  });
});
