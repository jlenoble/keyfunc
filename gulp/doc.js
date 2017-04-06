import gulp from 'gulp';
import md from 'markdown-include';

import {docGlob} from './globs';

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
  return md.compileFiles(docGlob);
};

gulp.task('doc', doc);
