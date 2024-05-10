const { src, dest } = require('gulp');
const tsc = require('gulp-typescript');

exports.default = function() {
    return src("./**/*.ts")
    .pipe(tsc())
    .pipe(dest("./scripts/"));
}

////////exports.default = function() {
////////    return src("data/ts-compile/**/*.ts")
////////    .pipe(tsc())
////////    .pipe(dest("BP/scripts/"));
////////}