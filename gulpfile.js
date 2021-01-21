const { src, dest, parallel, series, watch } = require('gulp');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');
const htmlmin = require('gulp-htmlmin');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const del = require('del');

function browsersync() {
	browserSync.init({
		server: 'dist/',
		online: true,
		notify: false,
		ui: false,
	});
}

function html() {
	return src('src/pug/pages/**/*.pug')
		.pipe(pug({ pretty: true }))
		.pipe(
			htmlmin({
				collapseWhitespace: true,
				removeComments: true,
			})
		)
		.pipe(dest('dist'));
}

function styles() {
	return src('src/styles/**/*.scss')
		.pipe(sass())
		.pipe(postcss())
		.pipe(dest('dist/styles'))
		.pipe(browserSync.stream());
}

function scripts() {
	return src('src/js/*.js')
		.pipe(concat('index.js'))
		.pipe(babel())
		.pipe(uglify())
		.pipe(dest('dist/js/'))
		.pipe(browserSync.stream());
}

function fonts() {
	return src('src/public/fonts/*').pipe(dest('dist/public/fonts'));
}

function clean() {
	return del('dist', { force: true });
}

function startwatch() {
	watch('src/pug/**/*.pug').on('change', series(html, browserSync.reload));
	watch('src/styles/**/*.scss').on('change', styles);
	watch('src/js/**/*.js').on('change', scripts);
}

exports.browsersync = browsersync;
exports.watch = watch;
exports.scripts = scripts;
exports.styles = styles;
exports.html = html;
exports.fonts = fonts;
exports.clean = clean;

exports.default = series(clean, parallel(html, styles, scripts, fonts), parallel(browsersync, startwatch));
