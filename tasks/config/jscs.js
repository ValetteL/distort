/**
 * JSCS
 *
 * ---------------------------------------------------------------
 *
 * # default task config
 * Enforce Coding standards
 *
 *
 * For usage docs see:
 *      https://github.com/jscs-dev/grunt-jscs
 */
module.exports = function(grunt) {

  grunt.config.set('jscs', {
    options: {
      config: ".jscsrc"
    },
    distort: {
      files: {
        src: ["distort.js"]
      }
    }
  });

};
