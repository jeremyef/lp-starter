'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')({rename: {'gulp-minify-css': 'minifycss'}});
var wiredep = require('wiredep').stream;
var bowerFiles = require('main-bower-files');
var runSequence = require('run-sequence');

// Setting variables
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
    sass_dir: './app/styles/sass/*.scss',
    sass_css: './app/styles/css/sass.css',
    bootstrap_dir: './app/bower_components/bootstrap'

};
// Inject Bower dependencies to src
gulp.task('inject_bower',function(cb){
  return gulp.src(settings.app_index)
  .pipe(wiredep({directory: settings.bower_dir}))
  .pipe(gulp.dest(settings.app_dir));
});
// Inject css and js files from app/styles and app/scripts
gulp.task('inject_main', function(cb){
   return gulp.src(settings.app_index)
  .pipe(plugins.inject(gulp.src([settings.styles_dir + '.css', settings.scripts_dir + '.js'], {read: false}), {relative: true}))
  .pipe(gulp.dest(settings.app_dir));
});

// Compile SASS files
gulp.task('compile_sass', function(cb){
  return gulp.src(settings.sass_dir)
  .pipe(plugins.sass.sync().on('error', plugins.sass.logError))
  .pipe(gulp.dest('./app/styles'));
});


/* Distribution Tasks */

// Bundles all injected files in index
gulp.task('dist_bundle_files', function(){
  return gulp.src(settings.app_index)
    .pipe(plugins.useref())
    .pipe(plugins.if('*.js', plugins.uglify()))
    .pipe(plugins.if('*.css', plugins.minifycss()))
    .pipe(gulp.dest('dist'));
});
// Copies font directory from bootstrap
gulp.task('dist_copy_fonts', function(){
  return gulp.src(settings.bootstrap_dir + '/dist/fonts/*')
    .pipe(gulp.dest(settings.dist_dir + '/fonts'));
});



// Starts webserver with watch task.
gulp.task('webserver', ['watch'], function() {
  plugins.connect.server({
    root: settings.app_dir,
    livereload: true
  });
});
// Reloads index
gulp.task('reload', function () {
  gulp.src(settings.app_index)
  .pipe(plugins.connect.reload());
});
// Compiles sass THEN reloads index
gulp.task('reload_sass', ['compile_sass'], function () {
  gulp.src(settings.app_index)
  .pipe(plugins.connect.reload());
});
// Watches for file changes.
gulp.task('watch', function() {
  gulp.watch([settings.app_index, settings.scripts_dir], ['reload']);
  gulp.watch([settings.sass_dir], ['reload_sass']);
})



gulp.task('inject', function(cb){
  runSequence('inject_bower', 'inject_main', cb);
});
gulp.task('default', function(cb){
  runSequence('inject','webserver');
});
gulp.task('dist', function(cb){
  runSequence('dist_bundle_files','dist_copy_fonts');
});
