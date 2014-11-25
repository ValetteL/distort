/**
 * Run predefined tasks whenever watched file patterns are added, changed or deleted.
 *
 * ---------------------------------------------------------------
 *
 * Watch for changes on
 * - files in the `assets` folder
 * and re-run the appropriate tasks.
 *
 * For usage docs see:
 *      https://github.com/gruntjs/grunt-contrib-watch
 *
 */
module.exports = function(grunt) {

  grunt.config.set('watch', {
    options: {
      interrupt: false
    },

    distort: {
      files: ['src/distort.jsx', 'tests/specs/**/*.js'],
      tasks: ['react', 'usebanner', 'karma:watch:run', 'jshint', 'jscs']
    },

    flow: {
      files: ['src/*.jsx'],
      tasks: ['flow:watch:status']
    }

  });

};
