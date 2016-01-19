"use strict";

var gulp = require('gulp');
var path = require('path');
var sass = require('gulp-sass');
var runSequence = require('run-sequence');
var run = require('gulp-run');

const WEB_STATIC_SRC_DIR = path.resolve(__dirname, "./src/web/pages/static-src");
const WEB_STATIC_DIR = path.resolve(__dirname, "./src/web/pages/static");

gulp.task('sass:public', function () {
    gulp.src(WEB_STATIC_SRC_DIR + '/public/sass/**/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(WEB_STATIC_DIR + '/public/assets/css'));
});

gulp.task('sass:admin', function () {
    gulp.src(WEB_STATIC_SRC_DIR + '/admin/sass/**/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(WEB_STATIC_DIR + '/admin/assets/css'));
});

gulp.task('sass:watch', function () {
    gulp.watch(WEB_STATIC_SRC_DIR + '/**/*.scss', ['sass']);
});

gulp.task('sass', function (callback) {
    runSequence('sass:public', 'sass:admin', callback);
});
