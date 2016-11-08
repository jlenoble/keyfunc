import {expect} from 'chai';
import keyFunc from '../src/keyfunc';

describe('Testing README.md examples', function() {

  it(`Usage example` , function() {
    const key = keyFunc({
      idProperty: 'name',
      stem: 'name-',
      type: String
    });

    expect(key({name: 'Otto'})).to.equal(key({name: 'Otto'}));
    expect(key({name: 'Otto'})).to.equal('name-Otto');
  });

  it(`Advanced usage example` , function() {
    const key = keyFunc('strict', {idProperty: 'id'}, 'loose');

    class Class {constructor() {}}
    const c = new Class();
    const obj = {id: 1};
    expect(key(c, obj, {color: 'blue'})).to.equal(
      key(c, obj, {color: 'blue'}));
    expect(key(c, obj, {color: 'blue'})).to.equal(
      key(c, {id: 1, misc: 1}, {color: 'blue'}))
    expect(key(c, obj, {color: 'blue'})).not.to.equal(
      key(c, {id: 2}, {color: 'blue'}));
    expect(key(c, obj, {color: 'blue'})).not.to.equal(
      key(c, obj, {color: 'red'}));
    expect(key(c, obj, {color: 'blue'})).not.to.equal(
      key(console, obj, {color: 'blue'}));
  });

});
