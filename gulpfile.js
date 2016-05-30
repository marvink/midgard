var gulp = require('gulp');
var run = require('gulp-run');
var gutil = require('gulp-util');
var clean = require('gulp-clean');
var wiredep = require('wiredep');
var merge = require('merge-stream');
var livereload = require('gulp-livereload');
var electron = require('gulp-electron');
var packageJson = require('./src/package.json');
var winInstaller = require('electron-windows-installer');

var $ = require('gulp-load-plugins')();

var BASE_DIR = './src/',
	SRC_DIR = BASE_DIR + 'src/',
	SASS_DIR = SRC_DIR + 'scss/',
	JS_DIR = SRC_DIR + 'js/',
	FONT_DIR = SRC_DIR + 'iconfont/',
	OUT_DIR = BASE_DIR + '',
	CSS_OUT = OUT_DIR + 'css/',
	JS_OUT = OUT_DIR + 'js/';
	FONT_OUT = OUT_DIR + 'img/fonts/';

gulp.task('exe', function(done) {
	//gulp.src('./release').pipe(clean({force: true}))


  winInstaller({
    appDirectory: './build/v1.2.0/win32-ia32',
    outputDirectory: './release',
    arch: 'ia32',    
    authors: 'Marvin Kerkhoff',
    noMsi: false,
    version: "0.2.0",
    setupExe: 'Midgard-Setup.exe',
    iconUrl: 'http://midgard-online.de/favicon-midgard-online.ico'
  }).then(done).catch(done);
});

gulp.task('build', function() {
	  //gulp.src('./build').pipe(clean({force: true}))

    gulp.src("")
    .pipe(electron({
        src: './src',
        packageJson: packageJson,
        release: './build',
        cache: './cache',
        version: 'v1.2.0',
        packaging: true,
        platforms: ['win32-ia32'],
        platformResources: {            
            win: {
                "version-string": packageJson.version,
                "file-version": packageJson.version,
                "product-version": packageJson.version,
                "icon": 'http://midgard-online.de/favicon-midgard-online.ico'
            }
        }
    }))
    .pipe(gulp.dest(""));
});

gulp.task('styles', function () {
	var styles = gulp.src(SASS_DIR + '*.scss')
		//.pipe($.sourcemaps.init())
		.pipe($.sass({
			outputStyle: 'expanded',
			precision: 10,
			includePaths: ['.'],
			onError: console.error.bind(console, 'Sass error:'),
			
		}))
		.pipe($.postcss([
			require('autoprefixer-core')({browsers: ['last 3 version','IE >= 8']})
			]))
		//.pipe($.sourcemaps.write('.'))
		.pipe(gulp.dest(CSS_OUT))
		.pipe(livereload());

	return merge(styles);
});

gulp.task('watch', ['styles', 'scripts', 'bower'], function () {
	livereload.listen();
	gulp.watch(SASS_DIR + '**/*.scss', ['styles']);
	gulp.watch(JS_DIR + '**/*.js', ['scripts']);
	gulp.watch('./bower.json', ['bower']);
});

gulp.task('scripts', function(){

	var widgets = gulp.src(JS_DIR + 'widgets/*.js')

	var main = gulp.src(JS_DIR + '*.js')

	return merge(widgets, main).pipe($.concat('all.js')).pipe(gulp.dest(JS_OUT));;
});

gulp.task('bower', function(){
	var files = wiredep();

	return gulp.src(files.js)
		.pipe($.concat('vendor.js'))
		.pipe($.uglify())
		.pipe(gulp.dest(JS_OUT));
});

gulp.task('run', ['styles', 'scripts'], function() {
  return run('electron ./src').exec();
});

gulp.task('default', ['watch', 'run']);