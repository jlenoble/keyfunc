import {expect} from 'chai';
import keyfunc from '../src/keyfunc';

describe(`Testing option unordered`, function () {
  it(`Single hint type`,
  function () {
    const key = keyfunc({type: 'object', unordered: true});

    const o1 = {id: 1};
    const o2 = {id: 2};
    const o3 = {id: 3};
    expect(key(o1, o2, o3)).to.equal(key(o2, o1, o3));
    expect(key(o1, o2, o3)).to.equal(key(o2, o3, o1));
    expect(key(o1, o2, o3)).to.equal(key(o3, o2, o1));
  });
});
