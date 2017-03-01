const gulp = require('gulp');
const mocha = require('gulp-mocha');
const linter = require('gulp-eslint');
const shell = require('gulp-shell');


gulp.task('lint', () => {
  return gulp.src(['**/*.js', '!node_modules/**'])
      .pipe(linter('.eslintrc'))
      .pipe(linter.format())
      .pipe(linter.failAfterError())
      .on('error', () => {
        process.exit();
      });
});

gulp.task('test', ['lint'], () => {
  gulp.src('./test/**/*.js')
      .pipe(mocha());
});

gulp.task('start', ['test'], shell.task([
  'npm start',
]));

gulp.task('watch', () => {
  gulp.watch('**/*.js', ['test', 'lint']);
  gulp.start('test', 'lint', 'start');
});

gulp.task('default', ['test', 'lint']);