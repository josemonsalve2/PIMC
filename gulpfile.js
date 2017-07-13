'use strict';

var gulp      	= require('gulp'),
  	cssnano   	= require('gulp-cssnano'),
  	sass      	= require('gulp-sass'),
  	runSequence = require('run-sequence');

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
    .pipe(cssnano({
      autoprefixer: {browsers: supported, add: true}
    }))
    .pipe(gulp.dest('www/css'))
});

gulp.task('watch', ['scss'], function(){
  gulp.watch('www/scss/**/*.scss', ['scss']); 
  // Other watchers
});

gulp.task('default', function (callback) {
  runSequence(['scss', 'watch'],
    callback
  );
});
