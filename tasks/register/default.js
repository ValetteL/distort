module.exports = function(grunt) {
  grunt.registerTask('default', [
    'karma:watch:start',
    'watch'
  ]);
};