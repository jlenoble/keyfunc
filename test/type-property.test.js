import {expect} from 'chai';
import sig from 'sig';
import keyfunc from '../src/keyfunc';

describe(`Testing 'property' hint`, function () {
  it(`Hint as string`, function () {
    const key = keyfunc('property:id');

    expect(key({id: 1})).to.equal(sig(1));
    expect(key({id: console})).to.equal(sig(console));

    expect(() => key(1)).to.throw(
      `Can't generate key for object with no property 'id'`);
    expect(() => key(console)).to.throw(
      `Can't generate key for object with no property 'id'`);
  });

  it(`Hint as extended string 'property:id:name:first'`, function () {
    const key = keyfunc('property:id:name:first');

    expect(key({id: {name: {first: 'Jason'}}})).to.equal(sig('Jason'));

    expect(() => key(1)).to.throw(
      `Can't generate key for object with no property 'id'`);
    expect(() => key({id: 1})).to.throw(
      `Can't generate key for object with no property 'name'`);
    expect(() => key({id: {name: 'John Doe'}})).to.throw(
      `Can't generate key for object with no property 'first'`);
  });

  it(`Multi args is invalid`, function () {
    const key = keyfunc('property:id');

    expect(() => key({id: 1}, {id: 2})).to.throw(
      `Inconsistent number of arguments, can't generate key`);
  });

  it(`Hint as option with type 'property:object'`, function () {
    const key = keyfunc({
      type: 'property:object',
      property: 'data',
    });

    const o = {id: 1};
    const o2 = {id: 1};
    const obj = {data: o};
    const obj2 = {data: o2};

    expect(key(obj)).to.equal(key(obj));
    expect(key(obj)).not.to.equal(key(obj2));

    expect(key(obj)).to.equal('o1');
    expect(key(obj2)).to.equal('o2');
  });

  it(`Hint as option with type 'property:property:id'`, function () {
    const key = keyfunc({
      type: 'property:property:id',
      property: 'data',
    });

    const o = {id: 1};
    const o2 = {id: 1};
    const obj = {data: o};
    const obj2 = {data: o2};

    expect(key(obj)).to.equal(key(obj));
    expect(key(obj)).to.equal(key(obj2));
    expect(key(obj)).not.to.equal(key({data: {id: 2}}));

    expect(key(obj)).to.equal(sig(1));
  });

  it(`Hint as option with type 'property:array`, function () {
    const key = keyfunc({
      type: 'property:array',
      property: 'data',
    });

    const o = {id: 1};
    const o2 = {id: 1};
    const obj = {data: [o]};
    const obj2 = {data: [o, o2]};

    expect(key(obj)).to.equal(key(obj));
    expect(key(obj)).not.to.equal(key(obj2));
    expect(key(obj)).to.equal(key({data: [o]}));

    expect(key(obj2)).to.equal(key({data: [o, o2]}));
    expect(key(obj2)).not.to.equal(key({data: [o2, o]}));

    expect(key(obj)).to.equal(sig(['o1']));
    expect(key(obj2)).to.equal(sig(['o1', 'o2']));
    expect(key({data: [o2, o]})).to.equal(sig(['o2', 'o1']));
  });
});
