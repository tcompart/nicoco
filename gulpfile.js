/*global require*/

const gulp = require('gulp'),
	gutil = require('gulp-util'),
	useref = require('gulp-useref'),
	version = require('gulp-version-number'),
	revReplace = require('gulp-rev-replace'),
	gulpif = require('gulp-if'),
	lazypipe = require('lazypipe'),
	autoprefixer = require('gulp-autoprefixer'),
	less = require('gulp-less'),
	csso = require('gulp-csso'),
	inject = require('gulp-inject'),
	htmlmin = require('gulp-htmlmin'),
	minifyHtml = require('gulp-minify-html'),
	templateCache = require('gulp-angular-templatecache'),
	plumber = require('gulp-plumber'),
	sourcemaps = require('gulp-sourcemaps');

const image = require('gulp-image');

const bower = require('gulp-bower'),
	wiredep = require('wiredep').stream;

const connect = require('gulp-connect-php');

const del = require('del'),
	rev = require('gulp-rev');

const SRC = './src',
	APP_SRC = './src/app',
	APP_DEST = './dist';

const CONFIG = {};
function configure(done) {
	const dev = (!!gutil.env.type && gutil.env.type === 'dev');
	CONFIG.BUILD = dev ? SRC : APP_DEST;
	CONFIG.ISDEV = dev;
	done();
}


/**
 /* ######## UTIL FUNCTIONS ############### */
/**/
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
			templateHeader: '/* eslint-disable */\nangular.module("<%= module %>"<%= standalone %>).run(["$templateCache", function($templateCache) {',
			transformUrl: function (url) {
				const start = url.lastIndexOf('/');
				return url.substring(start);
			}
		}))
		.pipe(gulp.dest(APP_SRC + '/templates'));
});

function installBowerComponents(done) {
	bower();
	done();
}

gulp.task('install-deps', gulp.series(installBowerComponents, function () {
	return gulp.src(SRC + '/*.html')
		.pipe(wiredep())
		.pipe(gulp.dest(SRC));
}));

gulp.task('copy', function () {
	gulp.src([SRC + '/*.*', SRC + '/.*', '!' + SRC + '/*.html'])
		.pipe(gulp.dest(APP_DEST));
	return gulp.src([SRC + '/components/bootstrap/dist/fonts/**'])
		.pipe(gulp.dest(APP_DEST + '/fonts'));
});

gulp.task('html', function () {
	var versionConfig = {
		'value': '%MDS%',
		'append': {
			'key': 'v',
			'to': ['css', 'js']
		}
	};
	return gulp.src(APP_DEST + '/*.html')
		.pipe(htmlmin({collapseWhitespace: true}))
		.pipe(version(versionConfig))
		.pipe(gulp.dest(APP_DEST));
});

gulp.task('package-images', function () {
	return gulp.src(SRC + '/images/**/**')
		.pipe(image({
			jpegoptim: false,
			jpegRecompress: false,
			concurrent: 10
		}))
		.pipe(gulp.dest(APP_DEST + '/images'));
});

gulp.task('compile-less', gulp.series('install-deps', function () {
	return gulp.src(SRC + '/less/main.less')
		.pipe(plumber({errorHandler: errorLog}))
		.pipe(less({compress: true}))
		.pipe(plumber.stop())
		.pipe(gulp.dest(SRC + '/components'));
}));

gulp.task('injectSources', gulp.series('compile-less', function () {
	return gulp.src(SRC + '/*.html')
		.pipe(inject(gulp.src([APP_SRC + '/**/*.js', SRC + '/components/*.css'], {read: false}), {relative: true}))
		.pipe(gulp.dest(SRC));
}));

const buildStyles = lazypipe()
	.pipe(plumber, {errorHandler: errorLog})
	.pipe(csso)
	.pipe(autoprefixer)
	.pipe(rev);

gulp.task('build-assets', gulp.series('install-deps', 'templates', 'injectSources', function () {
	return gulp.src(SRC + '/*.html')
		.pipe(gulpif('*.css', buildStyles()))
		.pipe(sourcemaps.write('./'))
		.pipe(useref())
		.pipe(revReplace({canonicalUris: false}))
		.pipe(gulp.dest(APP_DEST));
}));

/**/
/* ########### CLEAN #################### */
/**/
function cleanDist(done) {
	return del([APP_DEST], done);
}

function cleanTemplateCache(done) {
	return del([APP_SRC + '/templates'], done);
}

function cleanModules(done) {
	return del(['./node_modules'], done);
}

function cleanComponents(done) {
	return del(['./src/components'], done);
}

gulp.task('clean-all', gulp.series(cleanDist, cleanComponents, cleanTemplateCache, cleanModules));

gulp.task('build', gulp.series(cleanDist, 'build-assets', 'package-images', 'copy', 'html'));

/**/
/* ########### SERVER #################### */
/**/

gulp.task('watch', function (done) {
	gulp.watch([SRC + '/**/*.*', '!' + SRC + '/**/template.js'], gulp.series('build'));
	done();
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

gulp.task('server', gulp.series(configure, 'build', gulp.parallel('php', 'watch')));

gulp.task('default', gulp.series('build'));
