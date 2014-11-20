module.exports = function(grunt) {
  grunt.registerTask('hint', [
    'jscs',
    'jshint',
    'jsvalidate'
  ]);
};
