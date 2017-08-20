'use strict';

var gulp      	= require('gulp'),
  	cssnano   	= require('gulp-cssnano'),
  	sass      	= require('gulp-sass'),
    runSequence = require('run-sequence'),
    connect     = require('gulp-connect');

var supported = [
  'last 2 versions',
  'safari >= 8',
  'ie >= 10',
  'ff >= 20',
  'ios 6',
  'android 4'
];

gulp.task('scss', function(){
  return gulp.src('www/scss/**/*.scss') // Gets all files ending with .scss in app/scss
    .pipe(sass())
    .pipe(cssnano({autoprefixer: {browsers: supported, add: true}}))
    .pipe(gulp.dest('www/css'))
    .pipe(connect.reload());
});

gulp.task('files', ['scss'], function () {
  gulp.src('www/**/*.html')
    .pipe(connect.reload());
  gulp.src('www/**/*.js')
    .pipe(connect.reload());
});

gulp.task('watch', ['scss'], function(){
  gulp.watch('www/scss/**/*.scss', ['scss']); 
  gulp.watch('www/**/*.html', ['files']);
  gulp.watch('www/**/*.js', ['files']);
});

gulp.task('webserver', function() {
  connect.server({
    root: 'www',
    port: 8888,
    livereload: true
  });
});

gulp.task('default', ['scss', 'webserver', 'watch']);

