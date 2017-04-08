import {expect} from 'chai';
import keyfunc from '../src/keyfunc';
import {toArray, toArrayOfArrays} from 'argu';
import path from 'path';

describe(`Testing option preprocess`, function () {
  it(`Only one array`, function () {
    const key = keyfunc({preprocess: toArray});
    const k = key([1, 2, 3]);

    expect(key(1, 2, 3)).to.equal(k);
  });

  it(`Only one array of arrays`, function () {
    const key = keyfunc({preprocess: toArrayOfArrays});
    const k = key([[1], [2], [3]]);

    expect(key(1, 2, 3)).to.equal(k);
    expect(key([1], [2], [3])).to.equal(k);
    expect(key([1, 2, 3])).to.equal(k);
  });

  it(`Calculator`, function () {
    const key = keyfunc({preprocess: eval});
    const k = key(2);

    expect(key('2')).to.equal(k);
    expect(key('8 / 4')).to.equal(k);
    expect(key('-6 + 8')).to.equal(k);
  });

  it(`Glob`, function () {
    const key = keyfunc({preprocess: options => {
      if (typeof options === 'string') {
        return options;
      }

      if (typeof options === 'object') {
        const {glob, cwd} = options;
        return path.join(cwd, path.relative(process.cwd(), glob));
      }
    }});
    const k = key('src/**/*.js');

    expect(key({
      glob: '**/*.js',
      cwd: 'src',
    })).to.equal(k);
  });
});
