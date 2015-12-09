'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')({rename: {'gulp-minify-css': 'minifycss'}});
var wiredep = require('wiredep').stream;
var bowerFiles = require('main-bower-files');
var runSequence = require('run-sequence');

var settings = {
    app_dir: './app',
    app_index: './app/index.html',
    dist_dir: './dist',
    dist_index: '.dist/index.html',
    bower_dir: './app/bower_components',
    scripts_dir: './app/scripts/*',
    scripts_main: './app/scripts/main.js',
    styles_dir: './app/styles/*',
    styles_main: './app/styles/main.css',
    sass_dir: './sass/*.scss',
    sass_css: './app/styles/css/sass.css',
    bootstrap_dir: './bower_components/bootstrap'

};
// Inject Bower dependencies to src
gulp.task('inject_bower',function(cb){
  return gulp.src(settings.app_index)
  .pipe(wiredep({directory: settings.bower_dir}))
  .pipe(gulp.dest(settings.app_dir));
});

gulp.task('inject_main', function(cb){
   return gulp.src(settings.app_index)
  .pipe(plugins.inject(gulp.src([settings.styles_dir + '.css', settings.scripts_dir + '.js'], {read: false}), {relative: true}))
  .pipe(gulp.dest(settings.app_dir));
});

gulp.task('inject', function(cb){
  runSequence('inject_bower', 'inject_main', cb);
});
