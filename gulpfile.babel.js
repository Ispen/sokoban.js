import gulp from 'gulp';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import minifyCSS from 'gulp-csso';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';
import webpack from 'webpack-stream';

gulp.task('css', () => {
  return gulp.src('src/client/stylesheets/*.css')
    .pipe(minifyCSS())
    .pipe(gulp.dest('public/stylesheets'));
});

gulp.task('phaser', () => {
  return gulp.src('node_modules/phaser/dist/phaser.min.bin')
    .pipe(gulp.dest('public/javascripts/bin'));
});

gulp.task('js-client', [ 'css', 'phaser' ], () => {
  return gulp.src('src/client/javascripts/*.js')
    .pipe(webpack())
    .pipe(babel())
    .pipe(sourcemaps.init())
    .pipe(concat('app.min.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/javascripts'));
});

gulp.task('webpack', () => {
  return gulp.src('public/javascripts/app.min.js')
    .pipe(gulp.dest('public/javascripts'));
});

gulp.task('js-server', () => {
  return gulp.src('src/server/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('build/'));
});

gulp.task('watch', () => {
  gulp.watch('src/client/javascripts/*.js', [ 'js-client' ]);
});
gulp.task('default', [ 'js-client', 'js-server' ]);
