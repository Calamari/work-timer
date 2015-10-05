var path = require('path');
var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var watch = require('gulp-watch');

// In case of 'gulp-sass'
// gulp.task('dev', function() {
//   return gulp.src('web-server/scss/*.scss')
//     .pipe(watch('web-server/scss/*.scss'))
//     .pipe(sass())
//     .pipe(gulp.dest('web-server/public/css'));
// });

gulp.task('dev', function() {
  return sass('web-server/scss/', {
    loadPath: path.join(__dirname, 'bower_components/')
  })
  .on('error', function (err) {
    console.error('Error!', err.message);
  })
  .pipe(gulp.dest('web-server/public/css'));
});

var watcher = gulp.watch('web-server/scss/*.scss', ['dev']);
watcher.on('change', function(event) {
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
});
