import gulp from 'gulp';
import jscs from 'gulp-jscs';
import babel from 'gulp-babel';

import {srcGlob, distDir} from './globs';

export const dist = () => {
  return gulp.src(srcGlob)
    .pipe(jscs())
    .pipe(jscs.reporter())
    .pipe(jscs.reporter('fail'))
    .pipe(babel())
    .pipe(gulp.dest(distDir));
};

gulp.task('dist', dist);
