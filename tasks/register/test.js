/**
 * CMD: grunt test
 *
 * ---------------------------------------------------------------
 *
 * Runs unit tests and `grunt hint`
 *
 */
module.exports = function(grunt) {
  grunt.registerTask('test', [
    'react',
    'usebanner',
    'karma:single',
    'hint'
  ]);
};
