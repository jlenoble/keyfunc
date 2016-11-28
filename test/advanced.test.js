import {expect} from 'chai';
import signature from 'sig';
import keyFunc from '../src/keyfunc';

describe('Testing keyFunc with option array:*', function() {

  it(`Calling keyFunc('array:object')` , function() {
    const key = keyFunc('array:object');

    const obj = {id: 1};
    expect(key([console, obj])).to.equal(key([console, obj]));
    expect(key([console, obj])).not.to.equal(key([obj, console]));
    expect(key([console, obj])).to.equal(signature(['1', '2']));
  });

  it(`Calling keyFunc('array:literal')` , function() {
    const key = keyFunc('array:literal');

    const obj = {id: 1};
    expect(key([console, obj])).to.equal(key([console, obj]));
    expect(key([console, obj])).not.to.equal(key([obj, console]));
    expect(key([console, obj])).to.equal(signature([
      signature(console), signature(obj)
    ]));
  });

  it(`Calling keyFunc('array:property:id')` , function() {
    const key = keyFunc('array:property:id');

    const obj = {id: 1};
    const obj2 = {id: 2};
    expect(key([obj2, obj])).to.equal(key([obj2, obj]));
    expect(key([obj2, obj])).not.to.equal(key([obj, obj2]));
    expect(key([obj2, obj])).to.equal(signature([
      signature(obj2.id), signature(obj.id)
    ]));
  });

  it(`Calling keyFunc('array:array')` , function() {
    const key = keyFunc('array:array');

    const o1 = {};
    const o2 = {id: 1};
    const o3 = {name: 'Karl'};

    const obj = [o1, o2, o3];
    const obj2 = [o2, o3];
    expect(key([obj2, obj])).to.equal(key([obj2, obj]));
    expect(key([obj2, obj])).not.to.equal(key([obj, obj2]));
    expect(key([obj2, obj])).to.equal(signature([
      signature(['1', '2']),
      signature(['3', '1', '2'])
    ]));
  });

  it(`Calling keyFunc('array:set')` , function() {
    const key = keyFunc('array:set');

    const o1 = {};
    const o2 = {id: 1};
    const o3 = {name: 'Karl'};

    const obj = [o1, o2, o3];
    const obj2 = [o2, o3];
    expect(key([obj2, obj])).to.equal(key([obj2, obj]));
    expect(key([obj2, obj])).not.to.equal(key([obj, obj2]));
    expect(key([obj2, obj])).to.equal(signature([
      signature(['1', '2']),
      signature(['1', '2', '3'])
    ]));
  });

});

describe('Testing keyFunc with option set:*', function() {

  it(`Calling keyFunc('set:object')` , function() {
    const key = keyFunc('set:object');

    const obj = {id: 1};
    expect(key([console, obj])).to.equal(key([console, obj]));
    expect(key([console, obj])).to.equal(key([obj, console]));
    expect(key([console, obj])).to.equal(signature(['1', '2']));
  });

  it(`Calling keyFunc('set:literal')` , function() {
    const key = keyFunc('set:literal');

    const obj = {id: 1};
    expect(key([console, obj])).to.equal(key([console, obj]));
    expect(key([console, obj])).to.equal(key([obj, console]));
    expect(key([console, obj])).to.equal(signature([
      signature(console), signature(obj)
    ].sort()));
  });

  it(`Calling keyFunc('set:property:id')` , function() {
    const key = keyFunc('set:property:id');

    const obj = {id: 1};
    const obj2 = {id: 2};
    expect(key([obj2, obj])).to.equal(key([obj2, obj]));
    expect(key([obj2, obj])).to.equal(key([obj, obj2]));
    expect(key([obj2, obj])).to.equal(signature([
      signature(obj2.id), signature(obj.id)
    ].sort()));
  });

  it(`Calling keyFunc('set:array')` , function() {
    const key = keyFunc('set:array');

    const o1 = {};
    const o2 = {id: 1};
    const o3 = {name: 'Karl'};

    const obj = [o1, o2, o3];
    const obj2 = [o2, o3];
    expect(key([obj2, obj])).to.equal(key([obj2, obj]));
    expect(key([obj2, obj])).to.equal(key([obj, obj2]));
    expect(key([obj2, obj])).to.equal(signature([
      signature(['1', '2']),
      signature(['3', '1', '2'])
    ].sort()));
  });

  it(`Calling keyFunc('set:set')` , function() {
    const key = keyFunc('set:set');

    const o1 = {};
    const o2 = {id: 1};
    const o3 = {name: 'Karl'};

    const obj = [o1, o2, o3];
    const obj2 = [o2, o3];
    expect(key([obj2, obj])).to.equal(key([obj2, obj]));
    expect(key([obj2, obj])).to.equal(key([obj, obj2]));
    expect(key([obj2, obj])).to.equal(signature([
      signature(['1', '2']),
      signature(['1', '2', '3'])
    ].sort()));
  });

});

describe('Testing keyFunc with option property:*', function() {

  it(`Calling keyFunc({type: 'property:object', property: 'id')` , function() {
    const key = keyFunc({
      type: 'property:object',
      property: 'id'
    });

    const o = {name: 'Amy'};
    const obj = {id: o};
    expect(key(obj)).to.equal(key(obj));
    expect(key(obj)).to.equal(key({id: o}));
    expect(key(obj)).not.to.equal(key({id: {name: 'Amy'}}));
    expect(key(obj)).to.equal('1');
  });

  it(`Calling keyFunc({type: 'property:array', property: 'id')` , function() {
    const key = keyFunc({
      type: 'property:array',
      property: 'id'
    });

    const o = {name: 'Amy'};
    const o2 = {name: 'Brice'};
    const obj = {id: [o, o2]};
    expect(key(obj)).to.equal(key(obj));
    expect(key(obj)).to.equal(key({id: [o, o2]}));
    expect(key(obj)).not.to.equal(key({id: [o2, o]}));
    expect(key(obj)).not.to.equal(key({id: [{name: 'Amy'}, {name: 'Brice'}]}));
    expect(key(obj)).to.equal(signature(['1', '2']));
  });

  it(`Calling keyFunc({type: 'property:set', property: 'id')` , function() {
    const key = keyFunc({
      type: 'property:set',
      property: 'id'
    });

    const o = {name: 'Amy'};
    const o2 = {name: 'Brice'};
    const obj = {id: [o, o2]};
    expect(key(obj)).to.equal(key(obj));
    expect(key(obj)).to.equal(key({id: [o, o2]}));
    expect(key(obj)).to.equal(key({id: [o2, o]}));
    expect(key(obj)).not.to.equal(key({id: [{name: 'Amy'}, {name: 'Brice'}]}));
    expect(key(obj)).to.equal(signature(['1', '2']));
  });

});
