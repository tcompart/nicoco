/*global __dirname*/

var gulp = require('gulp'),
	gutil = require('gulp-util'),
	useref = require('gulp-useref'),
	revReplace = require('gulp-rev-replace'),
	gulpif = require('gulp-if'),
	lazypipe = require('lazypipe'),
	autoprefixer = require('gulp-autoprefixer'),
	runSequence = require('run-sequence'),
	concat = require('gulp-concat'),
	less = require('gulp-less'),
	csso = require('gulp-csso'),
	uglify = require('gulp-uglify'),
	inject = require('gulp-inject'),
	minifyHtml = require('gulp-minify-html'),
	templateCache = require('gulp-angular-templatecache'),
	plumber = require('gulp-plumber'),
	sourcemaps = require('gulp-sourcemaps'),
	notify = require('gulp-notify');

var image = require('gulp-image');

var bower = require('gulp-bower'),
	composer = require('gulp-composer'),
	wiredep = require('wiredep').stream;

var connect = require('gulp-connect-php');

var del = require('del'),
	rev = require('gulp-rev'),
	rename = require('gulp-rename'),
	path = require('path'),
	join = path.join;

var SRC = './src',
	APP_SRC = './src/app',
	APP_DEST = './dist';

var CONFIG = {};
function configure() {
	var dev = (!!gutil.env.type && gutil.env.type === 'dev');
	CONFIG.BUILD = dev ? SRC : APP_DEST;
	CONFIG.ISDEV = dev;
}


/**
 /* ######## UTIL FUNCTIONS ############### */
/**/
function log(msg) {
	gutil.beep();
	if (msg) {
		gutil.log(gutil.colors.green(msg));
	}
	return gutil.noop();
}

function errorLog(msg) {
	gutil.log(gutil.colors.red(msg));
}

/**/
/* ########### BUILD #################### */
/**/
gulp.task('templates', function () {
	return gulp.src(APP_SRC + '/**/*.html')
		.pipe(minifyHtml({empty: true}))
		.pipe(templateCache({
			filename: 'template.js',
			module: 'nicoco',
			transformUrl: function (url) {
				var start = url.lastIndexOf('/');
				return url.substring(start);
			}
		}))
		.pipe(gulp.dest(APP_SRC + '/templates'));
});

gulp.task('compile-less', ['install-deps'], function () {
	return gulp.src(SRC + "/less/main.less")
		.pipe(plumber({errorHandler: errorLog}))
		.pipe(less({compress: true}))
		.pipe(plumber.stop())
		.pipe(gulp.dest(SRC + '/components'));
});

gulp.task('inject', ['compile-less'], function () {
	return gulp.src(SRC + '/*.html')
		.pipe(inject(gulp.src([APP_SRC + '/**/*.js', SRC + '/components/*.css'], {read: false}), {relative: true}))
		.pipe(gulp.dest(SRC));
});

var buildStyles = lazypipe()
	.pipe(plumber, {errorHandler: errorLog})
	.pipe(csso)
	.pipe(autoprefixer)
	.pipe(rev);

function buildScript(name) {
	return lazypipe().pipe(plumber, {errorHandler: errorLog})
		.pipe(sourcemaps.init)
		.pipe(concat, name)
		.pipe(uglify)
		.pipe(sourcemaps.write, './')
		.pipe(rev)
		.pipe(log, "Finished script " + name)();
}


gulp.task('build-assets', ['install-deps', 'templates', 'inject'], function () {
	var assets = useref.assets();
	return gulp.src(SRC + '/*.html')
		.pipe(assets)
		.pipe(gulpif('*.js', sourcemaps.init()))
		.pipe(gulpif('*.js', uglify()))
		.pipe(gulpif('*.js', rev()))
		.pipe(gulpif('*.css', buildStyles()))
		.pipe(sourcemaps.write('./'))
		.pipe(assets.restore())
		.pipe(useref())
		.pipe(revReplace({canonicalUris: false}))
		.pipe(gulp.dest(APP_DEST));
});

gulp.task('install-deps', function () {
	bower();
	composer({ bin: 'composer' });
	return gulp.src(SRC + '/*.html')
		.pipe(wiredep())
		.pipe(gulp.dest(SRC));
});

gulp.task('copy', function (done) {
	gulp.src([SRC + '/*.*', SRC + '/.*', '!' + SRC + '/*.html'])
		.pipe(gulp.dest(APP_DEST));
	return gulp.src([SRC + '/components/bootstrap/fonts/**'])
		.pipe(gulp.dest(APP_DEST + '/fonts'));
});

gulp.task('package-images', function (done) {
	return gulp.src(SRC + '/images/**/*.jpg')
		.pipe(image({
			jpegoptim: true
		}))
		.pipe(gulp.dest(APP_DEST + '/images'));
});

gulp.task('build', ['clean'], function (done) {
	runSequence(['build-assets', 'package-images', 'copy'], done);
});

gulp.task('build.dev', ['clean'], function (done) {
	runSequence(['templates', 'inject'], done);
});

/**/
/* ########### SERVER #################### */
/**/

gulp.task('watch', function (done) {
	gulp.watch([SRC+'/**/*.*', '!'+SRC+'/**/template.js'], ['build.it']);
	return done;
});

gulp.task('php', function () {
	connect.server({
		hostname: 'localhost',
		base: CONFIG.BUILD,
		keepalive: false,
		open: true
	}, function () {
		gutil.log(gutil.colors.bgMagenta('PHP server up and running.'));
	});
});

gulp.task('build.it', function (done) {
	configure();
	if (CONFIG.ISDEV) {
		return runSequence('build.dev', done);
	} else {
		return runSequence('build', done);
	}
});

gulp.task('server', function (done) {
	runSequence('build.it', 'php', 'watch', done);
});

/**/
/* ########### CLEAN #################### */
/**/
gulp.task('clean-dist', function () {
	return del(APP_DEST);
});

gulp.task('clean', ['clean-dist'], function () {
});

gulp.task('clean-templateCache', function () {
	return del(APP_SRC + '/templates');
});

gulp.task('clean-modules', function () {
	return del('./node_modules');
});

gulp.task('clean-components', function () {
	return del('./src/components');
});

gulp.task('clean-all', function (done) {
	runSequence(['clean', 'clean-components', 'clean-templateCache', 'clean-modules'], done);
});

gulp.task('default', ['build'], function () {
});
