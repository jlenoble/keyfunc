import {expect} from 'chai';
import keyfunc from '../src/keyfunc';

describe(`Testing option ntimes`, function () {
  it(`Single hint`,
  function () {
    const key1 = keyfunc({type: 'object', ntimes: 5});
    const key2 = keyfunc('object', 'object', 'object', 'object', 'object');

    const o1 = {id: 1};
    const o2 = {id: 2};
    const o3 = {id: 3};
    const o4 = {id: 4};
    const o5 = {id: 5};

    expect(key1(o1, o2, o3, o4, o5)).to.equal(key1(o1, o2, o3, o4, o5));
    expect(key1(o1, o2, o3, o4, o5)).to.equal(key2(o1, o2, o3, o4, o5));
  });
});
