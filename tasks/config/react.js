/**
 * React Tools
 *
 * ---------------------------------------------------------------
 *
 * Convert JSX to JS
 *
 *
 * For usage docs see:
 *      https://github.com/ericclemmons/grunt-react
 */
module.exports = function(grunt) {

  grunt.config.set('react', {
    options: {
      harmony: true,
      stripTypes: true
    },
    distort: {
      files: {
        'distort.jsx.js': 'src/distort.jsx'
      }
    }
  });

};
