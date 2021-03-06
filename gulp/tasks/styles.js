var gulp  = require('gulp'),
	gutil = require('gulp-util'),
	es	  = require('event-stream'),
	concat = require('gulp-concat'),
	sass = require('gulp-ruby-sass'),
	less = require('gulp-less'),
	styl = require('gulp-stylus'),
	filter = require('gulp-filter'),
	cssmin = require('gulp-cssmin'),
	flatten = require('gulp-flatten'),
	rename = require('gulp-rename'),
	combineMQ = require('gulp-combine-media-queries'),
	size = require('gulp-size'),
	bless = require('gulp-bless'),
	autoprefix = require('gulp-autoprefixer'),
	args = require('yargs').argv,
	gulpif = require('gulp-if'),
	notify = require('gulp-notify'),
	plumber = require('gulp-plumber'),
	browserSync = require('browser-sync'),
	todo = require('gulp-todo'),

	config = require('../config');

// Conditionals
var isProduction = args.type === 'production' ;
var isLess = args.flavor === 'less' ;
var isStyl = args.flavor === 'styl' ;
var isSass = !isLess && !isStyl;

// Pre-processor config
var configSASS = {
				style: isProduction ? 'compact' : 'expanded',
				sourcemap: true,
				sourcemapPath: '../scss',
				trace: false,
				precision: 2
};

gulp.task('styles:vendor','Include bower packages for builds(CSS)', function(){
	return gulp.src(config.base.vendor + '/**/*')
						.pipe(flatten())
						.pipe(filter('**/*.min.css'))
						.pipe(gulpif(isProduction, concat('vendor.css')))
						.pipe(gulpif(isProduction, rename({suffix: ".min"})))
						.pipe(gulpif(isProduction, gulp.dest(config.paths.styles.dest), gulp.dest(config.paths.styles.dest + '/vendor')));
});


	gulp.task('styles:sass', function(){
	//	console.log('Sassing your piece of art...');

		var src = '';
		/*
		if(isLess){
			src =  gulp.src(config.src.less)
											.pipe(less());
		}else if(isStyl){
			src =  gulp.src(config.src.styl)
											.pipe(styl({errors: true}));
		}else{*/
			  src =  gulp.src(config.src.sass)
												.pipe(sass(configSASS));
		/*}*/



		return es.concat(gulp.src(''), src)
						.pipe(autoprefix('last 2 version',
							'safari 5',
							'ie 8', 'ie 9',
							'opera 12.1',
							'ios 6',
							'android 4',
							'Firefox >= 4'))
						// bless the IE's
						//.pipe(bless())
						// Combine media-queries for production builds
						.pipe(gulpif(isProduction,combineMQ({log: !isProduction ? true : false })))
						// Minify for production
						.pipe(gulpif(isProduction,cssmin()))
						//
						.pipe(size())
						//
						//.pipe(todo())
						.pipe(gulp.dest(config.paths.styles.dest))
						// Pick .css only, as map files are also available down the
						// stream
						.pipe(filter('**/*.css'))
						// As stream is supported, auto-update browsers on finding CSS
						// based changes without full page reload
						.pipe(browserSync.reload({stream:true}));
	});



	gulp.task('styles',['flush:styles','styles:sass','styles:vendor'], function(){
		console.log('Styled...Totally!');
	});
