import gulp from 'gulp';
import md from 'markdown-include';
import replace from 'gulp-replace';
import rename from 'gulp-rename';
import wrap from 'gulp-wrap';

import {docGlob, docExamplesTestGlob, buildDir} from './globs';

md.includePattern = /^#include\s"\/?((\w|-)+\/)*(\w|-)+(\.test)?\.md"/gm;

md.reset = function () {
  md.tableOfContents = '';
  md.build = {};
};

md.buildLink = function (title, _anchor) {
  const anchor = _anchor
    .replace(/\W+/g, '-')
    .replace(/--+/g, '-')
    .replace(/^-/, '')
    .replace(/-$/, '')
    .toLowerCase();

  return '[' + title + '](#' + anchor + ')\n';
};

export const doc = () => {
  md.reset();
  return md.compileFiles(docGlob);
};

export const examples = () => {
  return gulp.src(docExamplesTestGlob, {
    base: process.cwd(),
    since: gulp.lastRun(examples),
  })
  .pipe(replace(/describe.*\n  it.*\n    /, ''))
  .pipe(replace(/\n  }\);\n}\);\n/, '\n'))
  .pipe(replace(/\n    /g, '\n'))
  .pipe(wrap('```js\n<%= contents %>```', {}, {parse: false}))
  .pipe(rename({
    extname: '.md',
  }))
  .pipe(gulp.dest(buildDir));
};

gulp.task('doc', gulp.series(examples, doc));
