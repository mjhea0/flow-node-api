const gulp = require('gulp');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const flow = require('gulp-flowtype');

gulp.task('scripts', () => {
  return gulp.src('src/**/*.js')
  .pipe(sourcemaps.init())
  .pipe(babel())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('build'));
});

gulp.task('flow', () => {
  return gulp.src('src/**/*.js')
  .pipe(flow({
    killFlow: false,
    declarations: './flow-typed'
  }));
});

gulp.task('watch', ['flow', 'scripts'], () => {
  gulp.watch('src/**/*.js', ['flow', 'scripts']);
});

gulp.task('default', ['watch']);
