import {expect} from 'chai';
import signature from 'sig';
import objectFunc from '../src/objectfunc';

describe('Testing objectFunc', function () {
  [undefined, 'object'].forEach(arg => {
    it(`Calling objectFunc(${arg ? JSON.stringify(arg) : ''})`, function () {
      const key = objectFunc(arg);

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
    });
  });

  ['key-', {stem: 'key-'}].forEach(arg => {
    it(`Calling objectFunc("object", ${JSON.stringify(arg)})`, function () {
      const key = objectFunc('object', arg);

      expect(key(console)).to.equal('key-1');
      expect(key({id: 1})).to.equal('key-2');

      expect(key(console)).to.equal('key-1');
      expect(key({id: 1})).to.equal('key-3');

      expect(() => key(1)).to.throw(
        `Function can only generate keys for objects,
but argument was: 1`);
      expect(() => key('title')).to.throw(
        `Function can only generate keys for objects,
but argument was: "title"`);

      expect(key([1])).to.equal('key-4');
      expect(key([1])).to.equal('key-5');
    });
  });

  it(`Calling objectFunc("literal")`, function () {
    const key = objectFunc('literal');

    expect(key(console)).to.equal(signature(console));
    expect(key({id: 1})).to.equal(signature({id: 1}));
    expect(key([1])).to.equal(signature([1]));
    expect(key(1)).to.equal(signature(1));
    expect(key('title')).to.equal(signature('title'));
  });

  ['key-', {stem: 'key-'}].forEach(arg => {
    it(`Calling objectFunc("literal", ${JSON.stringify(arg)})`, function () {
      const key = objectFunc('literal', arg);

      expect(key(console)).to.equal('key-' + signature(console));
      expect(key({id: 1})).to.equal('key-' + signature({id: 1}));
      expect(key([1])).to.equal('key-' + signature([1]));
      expect(key(1)).to.equal('key-' + signature(1));
      expect(key('title')).to.equal('key-' + signature('title'));
    });
  });

  it(`Calling objectFunc("property") throws`, function () {
    expect(() => objectFunc('property')).to.throw(TypeError,
      `propertyFunc requires a string as first argument,
but it was:`);
  });

  it(`Calling objectFunc("property", {"stem": "name-"}) throws`, function () {
    expect(() => objectFunc('property', {stem: 'name-'})).to.throw(TypeError,
      `propertyFunc requires a string as first argument,
but it was:`);
  });

  [{property: 'id'}, {property: 'name', stem: 'key-'}].forEach(arg => {
    it(`Calling objectFunc("property", ${JSON.stringify(arg)})`, function () {
      const key = objectFunc('property', arg);

      const obj = {};
      obj[arg.property] = 1;
      expect(key(obj)).to.equal((arg.stem ? arg.stem : '') + signature(1));
      obj[arg.property] = console;
      expect(key(obj)).to.equal((arg.stem ? arg.stem : '') +
        signature(console));

      expect(() => key(1)).to.throw(
        `Can't generate key for object with no property '${arg.property}'`);
      expect(() => key(console)).to.throw(
        `Can't generate key for object with no property '${arg.property}'`);
    });
  });

  it(`Calling objectFunc("anything") throws`, function () {
    expect(() => objectFunc('anything')).to.throw(TypeError,
      `Keys can't be created for type anything`);
  });
});
