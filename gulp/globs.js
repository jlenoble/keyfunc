import path from 'path';

function join (...args) {
  let len = args.length;
  let glob = args[len - 1];

  if (!Array.isArray(glob)) {
    glob = [glob];
  }

  args.pop();

  return glob.map(str => path.join(...args, str));
}

export const srcDir = 'src';
export const testDir = 'test';
export const buildDir = 'build';
export const distDir = 'lib';
export const docDir = 'docs';

export const apps = ['keyfunc'];
export const bundleGlob = 'bundle.js';
export const testBundleGlob = 'test_bundle.js';
export const docGlob = 'markdown.json';

export const srcGlob = join(srcDir, ['**/*.js', '**/*.jsx']);
export const testGlob = join(testDir, ['**/*.test.js', '**/*.test.jsx']);
export const allTestGlob = join(testDir, ['**/*.js', '**/*.jsx']);
export const docExamplesTestGlob = ['docs/examples/**/*.test.js'];

export const srcBuildGlob = join(buildDir, srcGlob);
export const testBuildGlob = join(buildDir, testGlob).concat(join(
  buildDir, docExamplesTestGlob));
export const docExamplesTestMdGlob = join(buildDir,
  ['docs/examples/**/*.test.md']);

export const allSrcGlob = srcGlob.concat(allTestGlob, docExamplesTestGlob);
export const allBuildGlob = srcBuildGlob.concat(testBuildGlob);
export const allDoc = join(docDir, ['**/*.md']).concat(docExamplesTestMdGlob,
  [docGlob]);

export const bundleRootGlob = join(buildDir, srcDir, 'demo.js');
export const testBundleRootGlob = join(buildDir, testDir, 'index.test.js');
export const bundleBuildGlob = join(buildDir, bundleGlob);
export const testBundleBuildGlob = join(buildDir, testBundleGlob);
