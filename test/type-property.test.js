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

  it(`Hint as option with type 'property:set`, function () {
    const key = keyfunc({
      type: 'property:set',
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
    expect(key(obj2)).to.equal(key({data: [o2, o]}));

    expect(key(obj)).to.equal(sig(['o1']));
    expect(key(obj2)).to.equal(sig(['o1', 'o2']));
    expect(key({data: [o2, o]})).to.equal(sig(['o1', 'o2']));
  });

  describe('Backward compatibility with v0.8.2', function () {
    const keyFunc = keyfunc;
    const signature = sig;

    it(`Calling keyFunc({type: 'property:object', property: 'id'})`,
      function () {
        const key = keyFunc({
          type: 'property:object',
          property: 'id',
        });

        const o = {name: 'Amy'};
        const obj = {id: o};
        expect(key(obj)).to.equal(key(obj));
        expect(key(obj)).to.equal(key({id: o}));
        expect(key(obj)).not.to.equal(key({id: {name: 'Amy'}}));
        expect(key(obj)).to.equal('o1');
      });

    it(`Calling keyFunc({type: 'property:literal', property: 'id'})`,
      function () {
        const key = keyFunc({
          type: 'property:literal',
          property: 'id',
        });

        const o = {name: 'Amy'};
        const obj = {id: o};
        expect(key(obj)).to.equal(key(obj));
        expect(key(obj)).to.equal(key({id: o}));
        expect(key(obj)).to.equal(key({id: {name: 'Amy'}}));
      });

    it(`Calling keyFunc({type: 'property:property:id', property: 'data'})`,
      function () {
        const key = keyFunc({
          type: 'property:property:id',
          property: 'data',
        });

        const obj = {data: {id: 1}};
        expect(key(obj)).to.equal(key(obj));
        expect(key(obj)).to.equal(key({data: {id: 1}}));
        expect(key(obj)).to.equal(signature(1));
      });

    it(`Calling keyFunc({type: 'property:property:id:id', property: 'data'})`,
      function () {
        const key = keyFunc({
          type: 'property:property:id:id',
          property: 'data',
        });

        const obj = {data: {id: {id: 1}}};
        expect(key(obj)).to.equal(key(obj));
        expect(key(obj)).to.equal(key({data: {id: {id: 1}}}));
        expect(key(obj)).not.to.equal(signature({id: 1}));
        expect(key(obj)).to.equal(signature(1));
      });

    it(`Calling keyFunc({type: 'property:array', property: 'id'})`,
      function () {
        const key = keyFunc({
          type: 'property:array',
          property: 'id',
        });

        const o = {name: 'Amy'};
        const o2 = {name: 'Brice'};
        const obj = {id: [o, o2]};
        expect(key(obj)).to.equal(key(obj));
        expect(key(obj)).to.equal(key({id: [o, o2]}));
        expect(key(obj)).not.to.equal(key({id: [o2, o]}));
        expect(key(obj)).not.to.equal(key({id: [{name: 'Amy'},
          {name: 'Brice'}]}));
        expect(key(obj)).to.equal(signature(['o1', 'o2']));
      });

    it(`Calling keyFunc({type: 'property:set', property: 'id'})`, function () {
      const key = keyFunc({
        type: 'property:set',
        property: 'id',
      });

      const o = {name: 'Amy'};
      const o2 = {name: 'Brice'};
      const obj = {id: [o, o2]};
      expect(key(obj)).to.equal(key(obj));
      expect(key(obj)).to.equal(key({id: [o, o2]}));
      expect(key(obj)).to.equal(key({id: [o2, o]}));
      expect(key(obj)).not.to.equal(key({id: [{name: 'Amy'},
        {name: 'Brice'}]}));
      expect(key(obj)).to.equal(signature(['o1', 'o2']));
    });
  });
});
