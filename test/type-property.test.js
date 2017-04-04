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
});
