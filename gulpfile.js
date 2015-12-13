var gulp = require("gulp");
var iconfont = require('gulp-iconfont');
var consolidate = require('gulp-consolidate');
var rename = require("gulp-rename");

var fontName = 'my-trello-extension-font';

gulp.task('iconfont', function(){
  return gulp.src(['src/icons/*.svg'])
    .pipe(iconfont({
      fontName: fontName,
      appendUnicode: true,
      formats: ['ttf', 'eot', 'woff']
    }))
    .on('glyphs', function(glyphs) {
      var options = {
        glyphs: glyphs.map(function(glyph) {
          // this line is needed because gulp-iconfont has changed the api from 2.0
          return { name: glyph.name, codepoint: glyph.unicode[0].charCodeAt(0) }
        }),
        fontName: fontName,
        fontPath: '../../fonts/', // set path to font (from your CSS file if relative)
        className: 's' // set class name in your CSS
      };
      gulp.src('src/templates/fontawesome-style.css')
        .pipe(consolidate('lodash', options))
        .pipe(rename({ basename:fontName }))
        .pipe(gulp.dest('dist/css/')); // set path to export your CSS

      // if you don't need sample.html, remove next 4 lines
      gulp.src('src/templates/fontawesome-style.html')
        .pipe(consolidate('lodash', options))
        .pipe(rename({ basename:'sample' }))
        .pipe(gulp.dest('dist/')); // set path to export your sample HTML
    })
    .pipe(gulp.dest('fonts/'));
});
