var gulp = require('gulp');
var mocha = require('gulp-mocha');
var path = require('path');

const TEST_DIR = "./test";

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

gulp.task('default', ['test']);