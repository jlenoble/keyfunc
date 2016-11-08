import {expect} from 'chai';
import signature from 'sig';
import propertyFunc from '../src/propertyfunc';

describe('Testing propertyFunc', function() {

  it(`Calling propertyFunc('id')` , function() {
    const key = propertyFunc('id');

    expect(key({id: 1})).to.equal(signature(1));
    expect(key({id: console})).to.equal(signature(console));

    expect(() => key(1)).to.throw(
      `Can't generate key for object with no property 'id'`);
    expect(() => key(console)).to.throw(
      `Can't generate key for object with no property 'id'`);
  });

  it(`Calling propertyFunc('name', 'key-')` , function() {
    const key = propertyFunc('name', 'key-');

    expect(key({name: 1})).to.equal('key-' + signature(1));
    expect(key({name: console})).to.equal('key-' + signature(console));

    expect(() => key(1)).to.throw(
      `Can't generate key for object with no property 'name'`);
    expect(() => key(console)).to.throw(
      `Can't generate key for object with no property 'name'`);
  });

});
