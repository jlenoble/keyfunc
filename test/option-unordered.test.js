import sig from 'sig';
import {expect} from 'chai';
import keyfunc from '../src/keyfunc';

describe(`Testing option unordered`, function () {
  it(`Single hint type`, function () {
    const key = keyfunc({type: 'object', unordered: true});

    const o1 = {id: 1};
    const o2 = {id: 2};
    const o3 = {id: 3};
    expect(key(o1, o2, o3)).to.equal(key(o2, o1, o3));
    expect(key(o1, o2, o3)).to.equal(key(o2, o3, o1));
    expect(key(o1, o2, o3)).to.equal(key(o3, o2, o1));
    expect(key(o1, o2, o3)).to.equal(sig('o1o2o3'));
  });

  it(`Option combined with option ntimes`, function () {
    const key = keyfunc({type: 'object', unordered: true, ntimes: 3});

    const o1 = {id: 1};
    const o2 = {id: 2};
    const o3 = {id: 3};
    const o4 = {id: 4};
    expect(key(o1, o2, o3)).to.equal(key(o2, o1, o3));
    expect(key(o1, o2, o3)).to.equal(key(o2, o3, o1));
    expect(key(o1, o2, o3)).to.equal(key(o3, o2, o1));
    expect(key(o1, o2, o3)).to.equal(sig('o1o2o3'));
    expect(() => key(o1, o2, o3, o4)).to.throw(Error,
      `Inconsistent number of arguments, can't generate key`);
  });
});
