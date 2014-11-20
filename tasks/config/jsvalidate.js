/**
 * JS Validation
 *
 * ---------------------------------------------------------------
 *
 * For usage docs see:
 *      https://github.com/ariya/grunt-jsvalidate
 */
module.exports = function(grunt) {

  grunt.config.set('jsvalidate', {
    options: {
      globals: {},
      esprimaOptions: {},
      verbose: false
    },
    distort: {
      files: {
        src: ['distort.js']
      }
    }
  });

};
