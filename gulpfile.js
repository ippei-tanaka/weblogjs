var gulp = require('gulp');
var mocha = require('gulp-mocha');
var path = require('path');
var sass = require('gulp-sass');

const TEST_DIR = "./test";
const WEB_STATIC_SRC_DIR = "./src/web/pages/static-src";
const WEB_STATIC_DIR = "./src/web/pages/static";


gulp.task('test', () => {
    return gulp.src(path.resolve(TEST_DIR, '*.js'), {read: false})
        .pipe(mocha({reporter: 'spec'}))
        .once('end', () => {
            process.exit();
        });
});

gulp.task('sass', function () {
    gulp.src(WEB_STATIC_SRC_DIR + '/sass/**/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(WEB_STATIC_DIR + '/assets/css'));
});

gulp.task('sass:watch', function () {
    gulp.watch(WEB_STATIC_SRC_DIR + '/sass/**/*.scss', ['sass']);
});

