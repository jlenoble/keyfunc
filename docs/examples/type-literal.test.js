import keyfunc from '../../src/keyfunc';
import {expect} from 'chai';
import sig from 'sig';

describe(`Hint type 'literal' example`, function () {
  it(``, function () {
    const key1 = keyfunc('literal');
    const key2 = keyfunc('literal', 'literal');
    const key3 = keyfunc('literal', 'literal', 'literal');

    const obj = {id: 1, name: 'Joe'};

    const k1 = key1(obj);
    const k2 = key2('John', 'Doe');
    const k3 = key3(42, obj, obj);

    expect(key1(obj)).to.equal(k1);
    expect(key1(21)).not.to.equal(k1);

    expect(key2('John', 'Doe')).to.equal(k2);
    expect(key2('Doe', 'John')).not.to.equal(k2);
    expect(key2('Jane', 'Doe')).not.to.equal(k2);

    expect(key3(42, obj, obj)).to.equal(k3);
    expect(key3(42, obj, {id: 1, name: 'Joe'})).to.equal(k3);
    expect(key3('42', obj, obj)).not.to.equal(k3);
  });
});
