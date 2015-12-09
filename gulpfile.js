'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')({rename: {'gulp-minify-css': 'minifycss'}});
var wiredep = require('wiredep').stream;
var bowerFiles = require('main-bower-files');

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
