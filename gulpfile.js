const gulp = require('gulp');
const mocha = require('gulp-mocha');
const linter = require('gulp-eslint');

gulp.task('test', () => {
  gulp.src('./test/**/*.js')
      .pipe(mocha());
});

gulp.task('lint', () => {
  return gulp.src(['**/*.js', '!node_modules/**'])
      .pipe(linter('.eslintrc.json'))
      .pipe(linter.format())
      .pipe(linter.failAfterError());
});

gulp.task('watch', function () {
  gulp.watch('**/*.js', ['test', 'lint']);
});

gulp.task('default', ['test', 'lint']);