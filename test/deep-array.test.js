import {expect} from 'chai';
import signature from 'sig';
import keyFunc from '../src/keyfunc';

describe(`Testing deep identity for option 'array'`, function() {

  it(`Calling keyFunc({type: 'array', sub: ['object', 'object']})` , function() {
    const key = keyFunc({
      type: 'array',
      sub: ['object', 'object'],
      stem: 'key'
    });

    const obj = {id: 1};
    expect(key([console, obj])).to.equal(key([console, obj]));
    expect(key([console, obj])).not.to.equal(key([obj, console]));
    expect(key([console, obj])).to.equal('key' + signature(['1_1']));

    expect(() => key([console, obj], [obj, obj])).to.throw(
      Error, `Too many arguments, can't generate key`);
  });

  it(`Calling keyFunc({type: 'array', sub: ['literal', 'literal']})` ,
    function() {
    const key = keyFunc({
      type: 'array',
      sub: ['literal', 'literal'],
      stem: 'key'
    });

    const obj = {id: 1};
    expect(key([console, obj])).to.equal(key([console, obj]));
    expect(key([console, obj])).not.to.equal(key([obj, console]));
    expect(key([console, obj])).to.equal('key' + signature([
      signature(console)+ '_' + signature(obj)]));

    expect(() => key([console, obj], [obj, obj])).to.throw(
      Error, `Too many arguments, can't generate key`);
  });

  it(`Calling keyFunc({type: 'array', sub: [
        {property: 'id'},
        {property: 'id'}
      ]})` , function() {
    const key = keyFunc({type: 'array', sub: [
      {property: 'id'},
      {property: 'id'}
    ]});

    const obj = {id: 1};
    const obj2 = {id: 2};
    expect(key([obj2, obj])).to.equal(key([obj2, obj]));
    expect(key([obj2, obj])).not.to.equal(key([obj, obj2]));
    expect(key([obj2, obj])).to.equal(signature([
      signature(2) + '_' + signature(1)]));

    expect(() => key([obj2, obj], [obj, obj])).to.throw(
      Error, `Too many arguments, can't generate key`);
  });

  it(`Calling keyFunc({type: 'array', sub: ['array', 'array']})` , function() {
    const key = keyFunc({type: 'array', sub: ['array', 'array']});

    const o1 = {};
    const o2 = {id: 1};
    const o3 = {name: 'Karl'};

    const obj = [o1, o2, o3];
    const obj2 = [o2, o3];
    expect(key([obj2, obj])).to.equal(key([obj2, obj]));
    expect(key([obj2, obj])).not.to.equal(key([obj, obj2]));
    expect(key([obj2, obj])).to.equal(signature([
      signature(['1', '2']) + '_' + signature(['1', '2', '3'])]));

    expect(() => key([obj2, obj], [obj, obj])).to.throw(
      Error, `Too many arguments, can't generate key`);
  });

  it(`Calling keyFunc({type: 'array', sub: ['set', 'set']})` , function() {
    const key = keyFunc({type: 'array', sub: ['set', 'set']});

    const o1 = {};
    const o2 = {id: 1};
    const o3 = {name: 'Karl'};

    const obj = [o1, o2, o3];
    const obj2 = [o2, o3];
    expect(key([obj2, obj])).to.equal(key([obj2, obj]));
    expect(key([obj2, obj])).not.to.equal(key([obj, obj2]));
    expect(key([obj2, obj])).to.equal(signature([
      signature(['1', '2']) + '_' + signature(['1', '2', '3'])]));

    expect(() => key([obj2, obj], [obj, obj])).to.throw(
      Error, `Too many arguments, can't generate key`);
  });

  it(`Calling keyFunc({type: 'array', sub: [
        'object',
        'literal',
        {property: 'id'},
        'array:property:name',
        'set'
      ]})` , function() {
    const key = keyFunc({type: 'array', sub: [
      'object',
      'literal',
      {property: 'id'},
      'array:property:name',
      'set'
    ]});

    const o1 = {};
    const o2 = {id: 1};
    const o3 = {name: 'Karl'};

    expect(key([
      o1,
      o3,
      o2,
      [o3],
      [o1, o2, o3]
    ])).to.equal(key([
      o1,
      o3,
      o2,
      [o3],
      [o1, o2, o3]
    ]));

    expect(key([
      o1,
      o3,
      o2,
      [o3],
      [o1, o2, o3]
    ])).to.equal(key([
      o1,
      {name: 'Karl'},
      {id: 1},
      [o3],
      [o1, o3, o2]
    ]));

    expect(key([
      o1,
      o3,
      o2,
      [o3],
      [o1, o2, o3]
    ])).not.to.equal(key([
      o1,
      o3,
      o2,
      [o3],
      [o1, {id: 1}, o3]
    ]));

    expect(key([
      o1,
      o3,
      o2,
      [o3],
      [o1, o2, o3]
    ])).not.to.equal(key([
      o1,
      o3,
      {id: 2},
      [o3],
      [o1, o2, o3]
    ]));

    expect(key([
      o1,
      o3,
      o2,
      [o3],
      [o1, o2, o3]
    ])).to.equal(key([
      o1,
      o3,
      o2,
      [{name: 'Karl'}],
      [o1, o2, o3]
    ]));

    expect(key([
      o1,
      o3,
      o2,
      [o3],
      [o1, o2, o3]
    ])).not.to.equal(key([
      o1,
      o3,
      o2,
      [{name: 'Poppy'}],
      [o1, o2, o3]
    ]));

    expect(key([
      o1,
      o3,
      o2,
      [o3],
      [o1, o2, o3]
    ])).to.equal(signature([`1_${signature(o3)}_${signature(1)}_${
      signature([signature('Karl')])}_${signature(['1', '2', '3'])}`]));

    expect(() => key([
      o1,
      o3,
      o2,
      [o3],
      [o1, o2, o3]
    ], [
      o1,
      o3,
      o2,
      [o3],
      [o1, o2, o3]
    ])).to.throw(
      Error, `Too many arguments, can't generate key`);

  });

  it(`Calling keyFunc({type: 'array', sub: [
        'object',
        'literal',
        {property: 'id'},
        'array:property:name',
        'set'
      ], stem: 'key', rest: true})` , function() {
    const key = keyFunc({
      type: 'array',
      sub: [
        'object',
        'literal',
        {property: 'id'},
        'array:property:name',
        'set'
      ],
      stem: 'key',
      rest: true
    });

    const o1 = {};
    const o2 = {id: 1};
    const o3 = {name: 'Karl'};

    expect(key([
      o1,
      o3,
      o2,
      [o3],
      [o1, o2, o3]
    ])).to.equal(key([
      o1,
      o3,
      o2,
      [o3],
      [o1, o2, o3]
    ]));

    expect(() => key([
      o1,
      o3,
      o2,
      [o3],
      [o1, o2, o3]
    ], [
      o1,
      o3,
      o2,
      [o3],
      [o1, o2, o3]
    ])).not.to.throw(
      Error, `Too many arguments, can't generate key`);

    expect(key([
      o1,
      o3,
      o2,
      [o3],
      [o1, o2, o3]
    ], [
      o1,
      o3,
      o2,
      [o3],
      [o1, o2, o3]
    ])).to.equal(key([
      o1,
      o3,
      o2,
      [o3],
      [o1, o2, o3]
    ], [
      o1,
      o3,
      o2,
      [o3],
      [o1, o2, o3]
    ]))

    expect(key([
      o1,
      o3,
      o2,
      [o3],
      [o1, o2, o3]
    ], [
      o1,
      o3,
      o2,
      [o3],
      [o1, o2, o3]
    ])).not.to.equal(key([
      o1,
      o3,
      o2,
      [o3],
      [o1, o2, o3]
    ], [
      o3,
      o1,
      o2,
      [o3],
      [o1, o2, o3]
    ]))

    expect(key([
      o1,
      o3,
      o2,
      [o3],
      [o1, o2, o3]
    ], [
      o1,
      o3,
      o2,
      [o3],
      [o1, o2, o3]
    ])).to.equal(key([
      o1,
      o3,
      o2,
      [o3],
      [o1, o2, o3]
    ], [
      o1,
      o3,
      o2,
      [o3],
      [o3, o2, o1]
    ]))

    expect(key([
      o1,
      o3,
      o2,
      [o3],
      [o1, o2, o3]
    ], [
      o1,
      o3,
      o2,
      [o3],
      [o1, o2, o3]
    ])).not.to.equal(key([
      o1,
      o3,
      o2,
      [o3],
      [o1, o2, o3]
    ], [
      o1,
      o3,
      o2,
      [o3],
      [o1, {id: 1}, o3]
    ]))

  });

});
