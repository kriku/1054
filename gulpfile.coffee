gulp = require 'gulp'
less = require 'gulp-less'

gulp.task 'less', ->
  gulp.src 'bower/bootstrap/less/bootstrap.less'
    .pipe less set: ['compress']
    .pipe gulp.dest 'css/'

gulp.task 'watch', ->
  gulp.watch 'bower/bootstrap/less/**/*.less', ['less']

gulp.task 'default', ['less', 'watch']