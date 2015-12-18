'use strict';

// Initialize required packages
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')(
  {rename: {'gulp-minify-css': 'minifycss'}}
);
var wiredep = require('wiredep').stream;
var runSequence = require('run-sequence');

/* Setting variables
  A javascript dictionary with key pair values for directory settings.
  These directory locations are used multiple times within this gulpfile.
  Having them stored in this dictionary helps with reusability.
*/
var settings = {
    app_dir: './app',
    app_index: './app/index.html',
    dist_dir: './dist',
    dist_index: '.dist/index.html',
    bower_dir: './app/bower_components',
    scripts_dir: './app/scripts',
    scripts_dir_all: './app/scripts/*',
    scripts_main: './app/scripts/main.js',
    styles_dir: './app/styles',
    styles_dir_all: './app/styles/*',
    styles_main: './app/styles/main.css',
    sass_dir: './app/styles/sass',
    sass_dir_all: './app/styles/sass/*.scss',
    sass_css: './app/styles/css/sass.css',
    bootstrap_dir: './app/bower_components/bootstrap'

};
/* ------------
   Injection Tasks - These tasks are used to inject css/js resources into index.html
   ------------ */

/* Inject Bower dependencies to src
    This will inject all bower dependencies defined in bower.json into index.html
    CSS dependencies will be insert where the following tags are found:
    <!-- bower:css -->
    ..
    <!-- endbower -->
    JS dependencies will be inserted where the following tags are found:
    <!-- bower:js -->
    ..
    <!-- endbower -->
    This task uses the wiredep package
*/
gulp.task('inject_bower',function(cb){
  return gulp.src(settings.app_index)
  .pipe(wiredep({directory: settings.bower_dir}))
  .pipe(gulp.dest(settings.app_dir));
});
/* Inject css and js files from app/styles and app/scripts
    This will inject all bower dependencies defined in bower.json into index.html
    CSS dependencies will be insert where the following tags are found:
      <!-- inject:css -->
      ..
      <!-- endinject -->
    JS dependencies will be inserted where the following tags are found:
      <!-- inject:js -->
      ..
      <!-- endinject -->
    This task uses the gulp-inject package
*/
gulp.task('inject_main', function(cb){
   return gulp.src(settings.app_index)
  .pipe(plugins.inject(gulp.src([settings.styles_dir_all + '.css', settings.scripts_dir_all + '.js'], {read: false}), {relative: true}))
  .pipe(gulp.dest(settings.app_dir));
});

/* ------------
   Compile Tasks - These tasks are used to compile various files
   ------------ */

/* Compile SASS files
    This will compile the sass files found the sass directory (settings.sass_dir_all) into a .css file and puts it in the styles directory (settings.styles_dir)
    i.e.
      app/sass/main.scss -> Compile to -> app/styles/main.css
*/
gulp.task('compile_sass', function(cb){
  return gulp.src(settings.sass_dir_all)
  .pipe(plugins.sass.sync().on('error', plugins.sass.logError))
  .pipe(gulp.dest(settings.styles_dir));
});


/* ------------
   Distribution Tasks - These tasks are used to create a distribution version of the app in the dist directory (settings.dist_dir)
   ------------ */

/* Bundles all injected files in index
    Uses gulp-useref to parse src file, in this case the index file (settings.app_index), parses serveral css/js to be built into a single file, and will minify/uglify the files.
    It bundles js/css into vendor and main.
      vendor: JS/CSS from bower dependencies
      main: JS/CSS written by the user

    The parsed CSS blocks are wrapped as:
    <!-- build:css styles/vendor.css -->
      (bower css  depenencies)
    <!-- endbuild -->
    <!-- build:css styles/main.css -->
      (user css)
    <!-- endbuild -->

    The parsed JS blocks are wrapped as:
    <!-- build:js scripts/vendor.js -->
      (bower JS  depenencies)
    <!-- endbuild -->
    <!-- build:js scripts/main.js -->
      (user JS)
    <!-- endbuild -->
*/
gulp.task('dist_bundle_files', function(){
  return gulp.src(settings.app_index)
    .pipe(plugins.useref())
    .pipe(plugins.if('*.js', plugins.uglify()))
    .pipe(plugins.if('*.css', plugins.minifycss()))
    .pipe(gulp.dest(settings.dist_dir));
});
/* Copies font directory from bootstrap
    Copies font files from the boostrap directory, as its needed for bootstrap, into the dist directory.
*/
gulp.task('dist_copy_fonts', function(){
  return gulp.src(settings.bootstrap_dir + '/dist/fonts/*')
    .pipe(gulp.dest(settings.dist_dir + '/fonts'));
});

/* ------------
   Webserver Tasks - These tasks are used to create a webserver that will load the app directory (settings.app_dir) as the root directory
   ------------ */

// Starts webserver with watch task.
gulp.task('webserver', ['webserver_watch'], function() {
  plugins.connect.server({
    root: settings.app_dir,
    livereload: true
  });
});
// Starts webserver for dist directory
gulp.task('webserver_dist', function() {
   plugins.connect.server({
    root: settings.dist_dir,
    livereload: true
  });
});
// Reloads index
gulp.task('webserver_reload', function () {
  gulp.src(settings.app_index)
  .pipe(plugins.connect.reload());
});
// Compiles sass THEN reloads index
gulp.task('webserver_reload_sass', ['compile_sass'], function () {
  gulp.src(settings.app_index)
  .pipe(plugins.connect.reload());
});
// Watches for file changes.
gulp.task('webserver_watch', function() {
  gulp.watch([settings.app_index, settings.scripts_dir_all], ['webserver_reload']);
  gulp.watch([settings.sass_dir_all], ['webserver_reload_sass']);
})



gulp.task('inject', function(cb){
  runSequence('inject_bower', 'inject_main', cb);
});
gulp.task('default', function(cb){
  runSequence('inject','webserver');
});
gulp.task('dist', function(cb){
  runSequence('dist_bundle_files','dist_copy_fonts','webserver_dist');
});
