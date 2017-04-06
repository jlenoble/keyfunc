import {expect} from 'chai';
import sig from 'sig';
import keyfunc from '../src/keyfunc';

describe(`Testing option rest`, function () {
  it(`First arg with rest option`, function () {
    expect(() => keyfunc({type: 'object', rest: true}, {property: 'id'},
      'literal')).to.throw('Only last hint may have option rest');
  });

  it(`Second arg with rest option`, function () {
    expect(() => keyfunc({type: 'object', rest: true}, {property: 'id'},
      'literal')).to.throw('Only last hint may have option rest');
  });

  it(`Last arg with rest option`, function () {
    const key = keyfunc('object', {property: 'id'},
      {type: 'literal', rest: true});

    const obj = {id: 2};
    expect(key(console, {id: 1}, obj, obj)).to.equal(
      key(console, {id: 1}, obj, obj));
    expect(key(console, {id: 1}, obj, obj)).to.equal(
      sig('o1' + sig(1) + sig(sig(obj) + sig(obj))));

    expect(key(obj, {id: 2}, console, obj)).to.equal(
      key(obj, {id: 2}, console, obj));
    expect(key(obj, {id: 2}, console, obj)).to.equal(
      sig('o2' + sig(2) + sig(sig(console) + sig(obj))));
  });
});
