import {expect} from 'chai';
import signature from 'sig';
import keyFunc from '../src/keyfunc';

describe(`Testing keyFunc with option 'rest'`, function () {
  it(`Calling keyFunc({stem: 'id'}, {property: 'id'}, 'literal')`,
  function () {
    const key = keyFunc({stem: 'id'}, {property: 'id'}, 'literal');

    const obj = {id: 2};
    expect(() => key(console, {id: 1}, obj, obj)).to.throw();
  });

  it(`Calling keyFunc({stem: 'id', rest: true}, {property: 'id'}, 'literal')`,
  function () {
    const key = keyFunc({stem: 'id', rest: true}, {property: 'id'}, 'literal');

    const obj = {id: 2};
    expect(key(console, {id: 1}, obj, obj)).to.equal(
      key(console, {id: 1}, obj, obj));
    expect(key(console, {id: 1}, obj, obj)).to.equal(
      'id1_' + signature(1) + '_' + signature(obj) + '_id2');

    expect(key(obj, {id: 2}, console, obj)).to.equal(
      key(obj, {id: 2}, console, obj));
    expect(key(obj, {id: 2}, console, obj)).to.equal(
      'id2_' + signature(2) + '_' + signature(console) + '_id2');
  });

  it(`Calling keyFunc({stem: 'id'}, {property: 'id', rest: true}, 'literal')`,
  function () {
    const key = keyFunc({stem: 'id'}, {property: 'id', rest: true}, 'literal');

    const obj = {id: 2};
    expect(key(console, {id: 1}, obj, obj)).to.equal(
      key(console, {id: 1}, obj, obj));
    expect(key(console, {id: 1}, obj, obj)).to.equal(
      'id1_' + signature(1) + '_' + signature(obj) + '_' + signature(2));

    expect(key(obj, {id: 2}, console, obj)).to.equal(
      key(obj, {id: 2}, console, obj));
    expect(key(obj, {id: 2}, console, obj)).to.equal(
      'id2_' + signature(2) + '_' + signature(console) + '_' + signature(2));
  });
});
