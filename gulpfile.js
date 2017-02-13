var browserSync = require('browser-sync').create(),
	gulp = require('gulp'),
	changed = require('gulp-changed'),
	jscs = require('gulp-jscs'),
	notify = require('gulp-notify'),
	rename = require('gulp-rename'),
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat');

var config = {
	bowerDir: './bower_components/',
	src: './src/',
	dest: './www/assets/js/'
}


gulp.task('default', ['bundle-bower', 'bundle-scripts'], function() {
  // place code for your default task here
  
});

gulp.task('bundle-scripts', function() {
	var scripts = [
		config.src + 'js/models.js',
		config.src + 'js/views.js',
		config.src + 'js/main.js',
	]
	return gulp.src(scripts)
		.pipe(concat('app.js'))
		.pipe(gulp.dest('./www/assets/js'))
})

gulp.task('bundle-bower', function() {
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

gulp.task('browser-sync', function() {
    browserSync.init({
        proxy: "127.0.0.1:6001"
    });
});