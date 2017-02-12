var browserSync = require('browser-sync'),
	gulp = require('gulp'),
	changed = require('gulp-changed'),
	jscs = require('gulp-jscs'),
	notify = require('gulp-notify'),
	rename = require('gulp-rename'),
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat');

var config = {
	bowerDir: './bower_components/',
	dest: './www/assets/js/'
}


gulp.task('default', ['bundle-scripts'], function() {
  // place code for your default task here
});

gulp.task('bower', function() {
	return bower()
		.pipe(gulp.dest(config.bowerDir))
});

gulp.task('bundle-scripts', function() {
	var bower = [
		config.bowerDir + 'jquery/dist/jquery.js',
		config.bowerDir + 'underscore/underscore.js',
		config.bowerDir + 'backbone/backbone.js',
		config.bowerDir + 'bootstrap/dist/js/bootstrap.js',
		config.bowerDir + 'jquery-easing/jquery.easing.js'
	]
	return gulp.src(bower)
		.pipe(concat('vendor.js'))
		.pipe(uglify())
		.pipe(rename({ extname: '.min.js' }))
		.pipe(gulp.dest('./www/assets/js/'))
});