/**
 * Flow
 *
 * ---------------------------------------------------------------
 *
 * Flow type checking
 *
 * For usage docs see:
 *    https://github.com/isuttell/grunt-flow-type-check
 */
module.exports = function(grunt) {

  grunt.config.set('flow', {
    distort: {
      options: {
      	configFile: '.'
      }
    }
  });

};
