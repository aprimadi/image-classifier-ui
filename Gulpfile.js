var fs = require('fs')
var gulp = require('gulp')
var less = require('gulp-less')

gulp.task('less', function() {
  return gulp.src('./stylesheets/main.less')
    .pipe(less())
    .pipe(gulp.dest('./static/css'))
})

gulp.task('watch', function() {
  gulp.watch('stylesheets/**/*.less', ['less'])
})
