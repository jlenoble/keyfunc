import {expect} from 'chai';
import keyfunc from '../src/keyfunc';

describe(`Testing option sub`, function () {
  it(`Type array with sub options unordered/unique is a set`,
  function () {
    const key1 = keyfunc({
      type: 'array:property:id',
      sub: {
        unique: true,
        unordered: true,
      },
    });
    const key2 = keyfunc('set:property:id');

    const o1 = {id: 1};
    const o2 = {id: 2};
    const o3 = {id: 3};

    expect(key1([o1, o2, o2])).to.equal(key1([o1, o2]));
    expect(key1([o1, o2, o2])).to.equal(key1([o2, o1]));
    expect(key1([o3, o2, o3])).to.equal(key1([o3, o2]));
    expect(key1([o3, o2, o3])).to.equal(key1([o2, o3]));
    expect(key1([o1, o1, o1])).to.equal(key1([o1]));

    expect(key1([o1, o2, o2])).to.equal(key2([o1, o2, o2]));
    expect(key1([o1, o2, o2])).to.equal(key2([o1, o2, o2]));
    expect(key1([o3, o2, o3])).to.equal(key2([o3, o2, o3]));
    expect(key1([o3, o2, o3])).to.equal(key2([o3, o2, o3]));
    expect(key1([o1, o1, o1])).to.equal(key2([o1, o1, o1]));
  });

  it(`Type set with sub options unordered/unique to false is an array`,
  function () {
    const key1 = keyfunc({
      type: 'set:property:id',
      sub: {
        unique: false,
        unordered: false,
      },
    });
    const key2 = keyfunc('array:property:id');

    const o1 = {id: 1};
    const o2 = {id: 2};
    const o3 = {id: 3};

    expect(key1([o1, o2, o2])).not.to.equal(key1([o1, o2]));
    expect(key1([o1, o2, o2])).not.to.equal(key1([o2, o1]));
    expect(key1([o3, o2, o3])).not.to.equal(key1([o3, o2]));
    expect(key1([o3, o2, o3])).not.to.equal(key1([o2, o3]));
    expect(key1([o1, o1, o1])).not.to.equal(key1([o1]));

    expect(key1([o1, o2, o2])).to.equal(key2([o1, o2, o2]));
    expect(key1([o3, o2, o3])).to.equal(key2([o3, o2, o3]));
    expect(key1([o1, o1, o1])).to.equal(key2([o1, o1, o1]));
  });
});
