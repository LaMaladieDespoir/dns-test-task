var gulp = require('gulp');
var react = require('gulp-react');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var sass = require('gulp-sass');

process.env.NODE_ENV = 'development';

gulp.task('transform', function(){
	gulp.src('src/*.jsx')
		.pipe(react())
		.pipe(gulp.dest('src'));
});

gulp.task('browserify', function() {
	return browserify('src/index.js')
		.bundle()
		.pipe(source('tree.js'))
		.pipe(gulp.dest('./'));
});

gulp.task('sass', function () {
	gulp.src('./src/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('./'));
});

gulp.task('watch', function() {
	gulp.watch('src/*.jsx', function(event) {
		gulp.run('transform', 'browserify');
	});
	gulp.watch('src/*.scss', function(event) {
		gulp.run('sass');
	});
})

gulp.task('default', ['transform', 'browserify','sass']);
