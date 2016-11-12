import {expect} from 'chai';
import signature from 'sig';
import keyFunc from '../src/keyfunc';

describe('Testing keyFunc', function() {

  it(`Calling keyFunc('object')` , function() {
    const key = keyFunc('object');

    expect(key(console)).to.equal('1');
    expect(key({id: 1})).to.equal('2');

    expect(key(console)).to.equal('1');
    expect(key({id: 1})).to.equal('3');

    expect(() => key(1)).to.throw(
      `Function can only generate keys for objects,
but argument was: 1`);
    expect(() => key('title')).to.throw(
      `Function can only generate keys for objects,
but argument was: "title"`);

    expect(key([1])).to.equal('4');
    expect(key([1])).to.equal('5');

    expect(() => key(console, console)).to.throw(Error,
      `Too many arguments, can't generate key`);
    expect(() => key(console, console, {id: 1})).to.throw(Error,
      `Too many arguments, can't generate key`);
  });

  it(`Calling keyFunc('literal')` , function() {
    const key = keyFunc('literal');

    expect(key(console)).to.equal(signature(console));
    expect(key({id: 1})).to.equal(signature({id: 1}));
    expect(key([1])).to.equal(signature([1]));
    expect(key(1)).to.equal(signature(1));
    expect(key('title')).to.equal(signature('title'));

    expect(() => key(1, 'title', {id: 1})).to.throw(Error,
      `Too many arguments, can't generate key`);
  });

  it(`Calling keyFunc({property: 'id'})` , function() {
    const key = keyFunc({property: 'id'});

    expect(key({id: 1})).to.equal(signature(1));
    expect(key({id: console})).to.equal(signature(console));

    expect(() => key(1)).to.throw(
      `Can't generate key for object with no property 'id'`);
    expect(() => key(console)).to.throw(
      `Can't generate key for object with no property 'id'`);

    expect(() => key({id: 1}, {id: 2}, {id: 'title'})).to.throw(Error,
      `Too many arguments, can't generate key`);
  });

  it(`Calling keyFunc('object', 'literal')` , function() {
    const key = keyFunc('object', 'literal');

    expect(key(console, 'log')).to.equal(key(console, 'log'));
    expect(key(console, 'log')).to.equal('1_' + signature('log'));
    expect(() => key(1, 2)).to.throw(
      'Function can only generate keys for objects,\nbut argument was: 1');

    expect(() => key(console, 'log', {color: 'red'})).to.throw(Error,
      `Too many arguments, can't generate key`);
  });

  it(`Calling keyFunc({stem: 'id'}, {property: 'id'})` , function() {
    const key = keyFunc({stem: 'id'}, {property: 'id'});

    expect(key(console, {id: 1})).to.equal(key(console, {id: 1}));
    expect(key(console, {id: 1})).to.equal('id1_' + signature(1));
    expect(() => key(1, 2)).to.throw(
      'Function can only generate keys for objects,\nbut argument was: 1');

    expect(() => key(console, {id: 1}, {id: 'red'})).to.throw(Error,
      `Too many arguments, can't generate key`);
  });

  it(`Calling keyFunc('array')` , function() {
    const key = keyFunc('array');

    const obj = {id: 1};
    expect(key([console, obj])).to.equal(key([console, obj]));
    expect(key([console, obj])).not.to.equal(key([obj, console]));
    expect(key([console, obj])).to.equal(signature(['1', '2']));
  });

  it(`Calling keyFunc('set')` , function() {
    const key = keyFunc('set');

    const obj = {id: 1};
    expect(key([console, obj])).to.equal(key([console, obj]));
    expect(key([console, obj])).to.equal(key([obj, console]));
    expect(key([console, obj])).to.equal(signature(['1', '2']));
  });

});
