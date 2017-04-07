import gulp from 'gulp';

import {allSrcGlob, allBuildGlob, allDoc,
  docExamplesTestGlob} from './globs';
import {build} from './build';
import {test} from './test';
import {examples, doc} from './doc';

export const watch = done => {
  gulp.watch(allSrcGlob, build);
  gulp.watch(allBuildGlob, test);
  done();
};

export const watchdoc = done => {
  gulp.watch(docExamplesTestGlob, gulp.series(examples));
  gulp.watch(allDoc, doc);
  done();
};

gulp.task('watch', watch);
gulp.task('watchdoc', gulp.parallel(watch, watchdoc));
