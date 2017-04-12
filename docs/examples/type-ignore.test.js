import keyfunc from '../../src/keyfunc';
import {expect} from 'chai';

describe(`Hint type 'ignore' example`, function () {
  it(``, function () {
    const key1 = keyfunc('object', 'ignore');
    const key2 = keyfunc('object', 'ignore', 'literal');
    const key3 = keyfunc('ignore', 'ignore', 'property:name');

    const obj = {id: 1, name: 'Joe'};

    const k1 = key1(obj, 'anything');
    const k2 = key2(obj, 'foo', 'bar');
    const k3 = key3(42, 21, obj);

    expect(key1(obj, 'anything')).to.equal(k1);
    expect(key1(obj, 'anything else')).to.equal(k1);
    expect(key1({id: 1, name: 'Joe'}, 'anything else')).not.to.equal(k1);

    expect(key2(obj, 'foo', 'bar')).to.equal(k2);
    expect(key2(obj, 'quux', 'bar')).to.equal(k2);
    expect(key2(obj, 'foo', 'quux')).not.to.equal(k2);

    expect(key3(42, 21, obj)).to.equal(k3);
    expect(key3(obj, obj, obj)).to.equal(k3);
    expect(key3(42, 21, {id: 1, name: 'Jane'})).not.to.equal(k3);
  });
});
