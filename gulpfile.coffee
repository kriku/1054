gulp = require 'gulp'
less = require 'gulp-less'
connect = require 'gulp-connect'

gulp.task 'connect', ->
  connect.server
    port: 8080
    livereload: on
    root: ''

gulp.task 'less', ->
  gulp.src 'bower/bootstrap/less/bootstrap.less'
    .pipe less set: ['compress']
    .pipe gulp.dest 'css/'
    .pipe do connect.reload

gulp.task 'update', ->
  gulp.src '*.html'
    .pipe do connect.reload

gulp.task 'watch', ->
  gulp.watch 'bower/bootstrap/less/**/*.less', ['less']
  gulp.watch '**/*.html', ['update']

gulp.task 'default', ['less', 'connect', 'watch']