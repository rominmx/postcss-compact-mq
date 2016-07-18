var gulp = require('gulp'),
    postcss = require('gulp-postcss'),
    plugin = require('./index.js'),
    mocha = require('gulp-mocha');

gulp.task('default', function() {
    var processors = [plugin];

    return gulp.src('./examples/*.css')
        .pipe(postcss(processors))
        .pipe(gulp.dest('./examples/dist'));
});

gulp.task('test', function() {
	return gulp.src('./test/*.js', { read: false })
		.pipe(mocha());
});