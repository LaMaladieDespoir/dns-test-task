var gulp = require('gulp');
var react = require('gulp-react');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

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

gulp.task('watch', function() {
	gulp.watch('src/*.jsx', function(event) {
		gulp.run('default');
	});
})

gulp.task('default', ['transform', 'browserify']);
