const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const shell = require('gulp-shell');
const browserSync = require('browser-sync');

const paths = {
	siteSrc: 'src/',
	styleSrc: 'assets/scss/**/*.scss',
	scriptSrc: 'assets/js/**/*.js',
	siteDest: 'site',
	styleDest: 'site/css',
	scriptDest: 'site/js'
};

gulp.task('styles', () => {
	return gulp.src(paths.styleSrc)
	.pipe(sourcemaps.init())
	.pipe(sass({
		outputStyle: 'compressed',
		errLogToConsole: true
	}).on('error', sass.logError))
	.pipe(sourcemaps.write())
	.pipe(gulp.dest(paths.styleDest))
	.pipe(browserSync.reload({
		stream: true
	}))
});

gulp.task('scripts', () => {
	return gulp.src(paths.scriptSrc)
	.pipe(sourcemaps.init())
	.pipe(babel())
	.pipe(concat('scripts.js'))
	.pipe(uglify())
	.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest(paths.scriptDest))
	.pipe(browserSync.reload({
		stream: true
	}));
});

gulp.task('generate', shell.task('eleventy'));

gulp.task('browserSync', () => {
  browserSync.init({
    server: {
      baseDir: paths.siteDest
		},
		watchEvents: ['change', 'add'],
		watch: true
	});
	
});

gulp.task('watch', () => {
	gulp.watch(paths.styleSrc, 'styles');
	gulp.watch(paths.scriptSrc, 'scripts');
	shell.task('eleventy --watch');
});

gulp.task('default', gulp.series('generate', 'browserSync', 'watch'));