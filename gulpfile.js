var gulp = require('gulp');
var mocha = require('gulp-mocha');
var path = require('path');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');

const TEST_DIR = "./test";
const WEB_STATIC_SRC_DIR = "./src/web/pages/static-src";
const WEB_STATIC_DIR = "./src/web/pages/static";


gulp.task('test', () => {
    return gulp.src(path.resolve(TEST_DIR, '*.js'), {read: false})
        .pipe(mocha({reporter: 'spec'}))
        /*
        .once('error', function (err) {
            console.log(err);
            process.exit(1);
        })
        */
        .once('end', () => {
            process.exit();
        });
});

gulp.task('build', function () {
    var extensions = ['.jsx'];

    return browserify({entries: WEB_STATIC_SRC_DIR + '/main.jsx', extensions: extensions})
        .transform(babelify.configure({
            extensions: extensions,
            presets: ["es2015", "react"]
        }))
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest(WEB_STATIC_DIR + "/js"));
});

//gulp.task('default', ['test']);