module.exports = function(grunt) {
  grunt.registerTask('build', [
    'test',
    'asciify',
    'uglify'
  ]);
};
