import keyfunc from '../../src/keyfunc';
import {expect} from 'chai';

describe(`Hint type 'object' example`, function () {
  it(``, function () {
    const key1 = keyfunc();
    const key2 = keyfunc('object', 'object');
    const key3 = keyfunc('object', 'object', 'object');

    const obj = {id: 1, name: 'Joe'};

    const k1 = key1(String);
    const k2 = key2(Number, console);
    const k3 = key3(Math, obj, obj);

    expect(key1(String)).to.equal(k1);
    expect(key1(Number)).not.to.equal(k1);

    expect(key2(Number, console)).to.equal(k2);
    expect(key2(console, Number)).not.to.equal(k2);
    expect(key2(obj, console)).not.to.equal(k2);

    expect(key3(Math, obj, obj)).to.equal(k3);
    expect(key3(Math, obj, {id: 1, name: 'Joe'})).not.to.equal(k3);
    expect(key3(obj, Math, obj)).not.to.equal(k3);
  });
});
