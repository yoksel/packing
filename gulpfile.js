var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var include = require("gulp-include");
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');
var rename = require('gulp-rename');
var mqpacker = require("css-mqpacker");
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var copy = require('gulp-copy');
var ghPages = require('gulp-gh-pages');
var colors = require('colors/safe');

// SASS, AUTOPREFIXR, MINIMIZE
gulp.task('sass', function() {
  var processors = [
        autoprefixer({browsers: [
          'last 1 version',
          'last 2 Chrome versions',
          'last 2 Firefox versions',
          'last 2 Opera versions',
          'last 2 Edge versions'
          ]}),
        mqpacker(),
        //cssnano(),
    ];

  console.log('⬤  Run ' + colors.green('Sass') +
              ' + ' +
              colors.yellow('Autoprefixer') +
              ' + ' +
              colors.cyan('Cssnano'));

  return sass('src/scss/styles.scss')
    .pipe(postcss(processors))
    .pipe(gulp.dest('assets/css'))
    .pipe(reload({ stream:true }))
    .pipe(postcss([cssnano()]))
    .pipe(rename('styles.min.css'))
    .pipe(gulp.dest('assets/css'));
});

// IMAGES
gulp.task('images', function () {
  console.log(colors.magenta('⬤  Optimize images...'));

  return gulp.src('src/img/*')
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    }))
    .pipe(gulp.dest('assets/img'));
});

// INCLUDE BLOCKS IN HTML
gulp.task('include', function() {
  console.log(colors.magenta('⬤  Include files to HTML...'));

  gulp.src('src/index.html')
    .pipe(include())
      .on('error', console.log)
    .pipe(gulp.dest('.'))
    .pipe(reload({ stream:true }));
});

// WATCH SASS, PREPROCESS AND RELOAD
gulp.task('serve', ['sass'], function() {
  browserSync({
    server: {
      baseDir: '.'
    }
  });

  gulp.watch(['src/**/*.scss'], ['sass']);
  gulp.watch(['src/**/*.html'], ['include']);
  gulp.watch(['assets/**/*.js'], {cwd: '.'}, reload);
});

// COPY
gulp.task('copy', function() {
  console.log(colors.blue('⬤  Copy files to build/...'));

  return gulp.src(['assets/**/*', '*.html'])
    .pipe(copy('build/'));
});

// PUBLISH TO GITHUB PAGES
gulp.task('ghPages', function() {
  console.log(colors.rainbow('⬤  Publish to GithubPages...'));
  return gulp.src('build/**/*')
    .pipe(ghPages());
});

// BUILD
gulp.task('build', ['sass', 'include', 'copy']);

// DEPLOY
gulp.task('deploy', ['sass', 'include', 'copy', 'ghPages']);
