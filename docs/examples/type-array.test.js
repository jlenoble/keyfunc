import keyfunc from '../../src/keyfunc';
import {expect} from 'chai';

describe(`Hint type 'array' example`, function () {
  it(``, function () {
    const key1 = keyfunc('array');
    const key2 = keyfunc('array', 'array');
    const key3 = keyfunc('array', 'array', 'array');

    const obj1 = {id: 1, name: 'Joe'};
    const obj2 = {id: 2, name: 'Jane'};
    const obj3 = {id: 3, name: 'Joyce'};

    const k1 = key1([obj1, obj2, obj3]);
    const k2 = key2([obj1], [obj2, obj3]);
    const k3 = key3([obj1, obj2], [obj2, obj3], [obj3, obj1]);

    expect(key1([obj1, obj2, obj3])).to.equal(k1);
    expect(key1([obj1, obj3, obj2])).not.to.equal(k1);
    expect(key1([obj1, obj2])).not.to.equal(k1);

    expect(key2([obj1], [obj2, obj3])).to.equal(k2);
    expect(key2([obj2], [obj2, obj3])).not.to.equal(k2);
    expect(key2([obj1], [obj3, obj2])).not.to.equal(k2);

    expect(key3([obj1, obj2], [obj2, obj3], [obj3, obj1])).to.equal(k3);
    expect(key3([obj1, obj2], [obj2], [obj3, obj1])).not.to.equal(k3);
    expect(key3([obj3, obj1], [obj2, obj3], [obj1, obj2])).not.to.equal(k3);
  });
});
