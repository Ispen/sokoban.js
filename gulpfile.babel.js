import gulp from 'gulp';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import del from 'del';
import minifyCSS from 'gulp-csso';
import uglify from 'gulp-uglify';
import webpack from 'webpack-stream';

gulp.task('clean', () => {
  return del([ './build' ]);
});

gulp.task('copy', () => {
  return gulp.src('./client/images/**')
      .pipe(gulp.dest('./build/public/images/'));
});

gulp.task('css', () => {
  return gulp.src('./client/stylesheets/*.css')
    .pipe(minifyCSS())
    .pipe(gulp.dest('./build/public/stylesheets'));
});

gulp.task('phaser', () => {
  return gulp.src('./node_modules/phaser/dist/phaser.min.js')
    .pipe(gulp.dest('./build/public/javascripts/bin'));
});

gulp.task('webpack', () => {
  return gulp.src('./client/javascripts/*.js')
    .pipe(webpack(({
      devtool: 'source-map',
      output: {
        filename: 'app.min.js'
      }
    })))
    .pipe(gulp.dest('./build/public/javascripts'));
});

gulp.task('js-client', () => {
  return gulp.src('./client/javascripts/*.js')
    .pipe(webpack())
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat('app.min.js'))
    .pipe(gulp.dest('./build/public/javascripts'));
});

gulp.task('js-server', () => {
  return gulp.src('./server/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./build/'));
});

gulp.task('watch', () => {
  gulp.watch('./client/javascripts/*.js', gulp.series('webpack'));
});

gulp.task('default', gulp.series([ 'clean', 'copy', 'css', 'phaser', 'js-client', 'js-server' ]));
gulp.task('dev', gulp.series([ 'clean', 'copy', 'css', 'phaser', 'webpack', 'js-server', 'watch']));
