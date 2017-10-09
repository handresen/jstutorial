const gulp = require('gulp');
const eslint = require('gulp-eslint');
const babel = require('gulp-babel');
// Gulp deps

gulp.task('default', function(){
    // Gulp tasks
    gulp.src(["es6/**/*.js","public/es6/**/*.js"])
    .pipe(eslint()).pipe(eslint.format());

    // Node source 
    gulp.src("es6/**/*.js")
    .pipe(babel())
    .pipe(gulp.dest("dist")); 
    
    // browser source 
    gulp.src("public/es6/**/*.js")
    .pipe(babel())
    .pipe(gulp.dest("public/dist"));
});

