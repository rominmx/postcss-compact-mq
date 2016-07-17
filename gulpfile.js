var gulp = require('gulp'),
    postcss = require('gulp-postcss'),
    plugin = require('./index.js');

gulp.task('default', function() {
    var processors = [plugin];

    return gulp.src('./examples/*.css')
        .pipe(postcss(processors))
        .pipe(gulp.dest('./examples/dist'));
});