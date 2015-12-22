"use strict";

var gulp = require('gulp');
var mocha = require('gulp-mocha');
var path = require('path');
var sass = require('gulp-sass');
var runSequence = require('run-sequence');
var run = require('gulp-run');

const TEST_DIR = path.resolve(__dirname, "./test");
const WEB_STATIC_SRC_DIR = path.resolve(__dirname, "./src/web/pages/static-src");
const WEB_STATIC_DIR = path.resolve(__dirname, "./src/web/pages/static");


gulp.task('test:restful-api', () => {
    return gulp.src(path.resolve(TEST_DIR, 'restful-api/*.js'), {read: false})
        .pipe(mocha({reporter: 'spec'}));
});

gulp.task('test:model-managers', () => {
    return gulp.src(path.resolve(TEST_DIR, 'model-managers/*.js'), {read: false})
        .pipe(mocha({reporter: 'spec'}));
});

gulp.task('test', function (callback) {
    runSequence('test:model-managers', 'test:restful-api', callback);
});

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
