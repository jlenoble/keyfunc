import {expect} from 'chai';
import signature from 'sig';
import keyFunc from '../src/keyfunc';

describe(`Testing deep identity for option 'property'`, function() {

  it(`Calling keyFunc({
    type: 'property',
    property: 'data',
    sub: ['object', 'object']
  })`, function() {
    const key = keyFunc({
      type: 'property',
      property: 'data',
      sub: ['object', 'object'],
      stem: 'key'
    });

    const o1 = {id: 1};
    const o2 = {id: 2};
    const obj = {data: [o1, o2]}
    expect(key(obj)).to.equal(key(obj));
    expect(key(obj)).to.equal(key({data: [o1, o2]}));
    expect(key(obj)).not.to.equal(key({data: [{id: 1}, o2]}));
    expect(key(obj)).not.to.equal(key({data: [o2, o1]}));
    expect(key(obj)).to.equal('key' + signature(['1_1']));

    expect(() => key(obj, obj)).to.throw(
      Error, `Too many arguments, can't generate key`);
  });

  it(`Calling keyFunc({
    type: 'property',
    property: 'data',
    sub: ['literal', 'literal']
  })` ,
    function() {
    const key = keyFunc({
      type: 'property',
      property: 'data',
      sub: ['literal', 'literal'],
      stem: 'key'
    });

    const o1 = {id: 1};
    const o2 = {id: 2};
    const obj = {data: [o1, o2]};
    expect(key(obj)).to.equal(key(obj));
    expect(key(obj)).to.equal(key({data: [o1, o2]}));
    expect(key(obj)).to.equal(key({data: [{id: 1}, o2]}));
    expect(key(obj)).not.to.equal(key({data: [o2, o1]}));
    expect(key(obj)).to.equal('key' + signature(
      [signature(o1) + '_' + signature(o2)]));

    expect(() => key(obj, obj)).to.throw(
      Error, `Too many arguments, can't generate key`);
  });

  it(`Calling keyFunc({
    type: 'property',
    sub: [
      {property: 'id'},
      {property: 'id'}
    ],
    property: 'data'
  })` , function() {
    const key = keyFunc({
      type: 'property',
      property: 'data',
      sub: [
        {property: 'id'},
        {property: 'id'}
      ],
      stem: 'key'
    });

    const o1 = {id: 1};
    const o2 = {id: 2};
    const obj = {data: [o1, o2]};
    expect(key(obj)).to.equal(key(obj));
    expect(key(obj)).to.equal(key({data: [o1, o2]}));
    expect(key(obj)).to.equal(key({data: [{id: 1}, o2]}));
    expect(key(obj)).not.to.equal(key({data: [{id: 2}, o2]}));
    expect(key(obj)).not.to.equal(key({data: [o2, o1]}));
    expect(key(obj)).to.equal('key' + signature(
      [signature(1) + '_' + signature(2)]));

    expect(() => key(obj, obj)).to.throw(
      Error, `Too many arguments, can't generate key`);
  });

  it(`Calling keyFunc({
    type: 'property',
    sub: ['array', 'array'],
    property: 'data'
  })` , function() {
    const key = keyFunc({
      type: 'property',
      sub: ['array', 'array'],
      property: 'data',
      stem: 'key'
    });

    const o1 = {id: 1};
    const o2 = {id: 2};
    const obj = {data: [[o1], [o1, o2]]};
    expect(key(obj)).to.equal(key(obj));
    expect(key(obj)).to.equal(key({data: [[o1], [o1, o2]]}));
    expect(key(obj)).not.to.equal(key({data: [[{id: 1}], [o1, o2]]}));
    expect(key(obj)).not.to.equal(key({data: [[o1, o2], [o1]]}));
    expect(key(obj)).not.to.equal(key({data: [[o1], [o2, o1]]}));
    expect(key(obj)).to.equal('key' + signature([
      signature(['1']) + '_' + signature(['1', '2'])]));

    expect(() => key(obj, obj)).to.throw(
      Error, `Too many arguments, can't generate key`);
  });

  it(`Calling keyFunc({
    type: 'property',
    sub: ['set', 'set'],
    property: 'data'
  })` , function() {
    const key = keyFunc({
      type: 'property',
      sub: ['set', 'set'],
      property: 'data',
      stem: 'key'
    });

    const o1 = {id: 1};
    const o2 = {id: 2};
    const obj = {data: [[o1], [o1, o2]]};
    expect(key(obj)).to.equal(key(obj));
    expect(key(obj)).to.equal(key({data: [[o1], [o1, o2]]}));
    expect(key(obj)).not.to.equal(key({data: [[{id: 1}], [o1, o2]]}));
    expect(key(obj)).not.to.equal(key({data: [[o1, o2], [o1]]}));
    expect(key(obj)).to.equal(key({data: [[o1], [o2, o1]]}));
    expect(key(obj)).to.equal('key' + signature([
      signature(['1']) + '_' + signature(['1', '2'])]));

    expect(() => key(obj, obj)).to.throw(
      Error, `Too many arguments, can't generate key`);
  });

  it(`Calling keyFunc({
    type: 'property',
    sub: [
      'object',
      'literal',
      {property: 'id'},
      'array:property:name',
      'set'
    ],
    property: 'data'
  })`, function() {
    const key = keyFunc({
      type: 'property',
      sub: [
        'object',
        'literal',
        {property: 'id'},
        'array:property:name',
        'set'
      ],
      property: 'data'
    });

    const o1 = {};
    const o2 = {id: 1};
    const o3 = {name: 'Karl'};

    const obj = {
      data: [
        o1,
        o3,
        o2,
        [o3],
        [o1, o2, o3]
      ]
    };

    expect(key(obj)).to.equal(key(obj));
    expect(key(obj)).to.equal(key({data: [
      o1,
      {name: 'Karl'},
      {id: 1},
      [o3],
      [o1, o3, o2]
    ]}));
    expect(key(obj)).not.to.equal(key({data: [
      o1,
      o3,
      o2,
      [o3],
      [o1, {id: 1}, o3]
    ]}));
    expect(key(obj)).not.to.equal(key({data: [
      o1,
      o3,
      {id: 2},
      [o3],
      [o1, o2, o3]
    ]}));
    expect(key(obj)).to.equal(key({data: [
      o1,
      o3,
      o2,
      [{name: 'Karl'}],
      [o1, o2, o3]
    ]}));
    expect(key(obj)).not.to.equal(key({data: [
      o1,
      o3,
      o2,
      [{name: 'Poppy'}],
      [o1, o2, o3]
    ]}));

    expect(key(obj)).to.equal(signature([`1_${signature(o3)}_${signature(1)}_${
      signature([signature('Karl')])}_${signature(['1', '2', '3'])}`]));

    expect(() => key(obj, obj)).to.throw(
      Error, `Too many arguments, can't generate key`);

  });

  it(`Calling keyFunc({
    type: 'property',
    sub: [
      'object',
      'literal',
      {property: 'id'},
      'array:property:name',
      'set'
    ],
    property: 'data',
    stem: 'key',
    rest: true
  })` , function() {
    const key = keyFunc({
      type: 'property',
      sub: [
        'object',
        'literal',
        {property: 'id'},
        'array:property:name',
        'set'
      ],
      property: 'data',
      stem: 'key',
      rest: true
    });

    const o1 = {};
    const o2 = {id: 1};
    const o3 = {name: 'Karl'};

    const obj = {data: [
      o1,
      o3,
      o2,
      [o3],
      [o1, o2, o3]
    ]};

    expect(key(obj)).to.equal(key(obj));
    expect(() => key(obj, obj)).not.to.throw();
    expect(key(obj, obj)).to.equal(key(obj, obj));
    expect(key(obj, obj)).not.to.equal(key(obj, {data: [
      o3,
      o1,
      o2,
      [o3],
      [o1, o2, o3]
    ]}));
    expect(key(obj, obj)).to.equal(key(obj, {data: [
      o1,
      o3,
      o2,
      [o3],
      [o3, o2, o1]
    ]}));
    expect(key(obj, obj)).not.to.equal(key(obj, {data: [
      o1,
      o3,
      o2,
      [o3],
      [o1, {id: 1}, o3]
    ]}));

  });

  it(`Calling keyFunc({
    type: 'property',
    property: 'home:kitchen:table'
  })`, function() {
    const key = keyFunc({
      type: 'property',
      property: 'home:kitchen:table'
    });

    const obj = {home: {kitchen: {table: 'blue'}}};
    const obj2 = {home: {kitchen: {table: 'red'}}};
    expect(key(obj)).to.equal(key(obj));
    expect(key(obj)).not.to.equal(key(obj2));
    expect(key(obj)).to.equal(key({home: {kitchen: {table: 'blue'}}}));
    expect(() => key({home: {livingRoom: {table: 'blue'}}}))
      .to.throw(ReferenceError,
      `Can't generate key for object with no property 'kitchen'`);
    expect(key(obj)).to.equal(signature('blue'));
  });

  it(`Calling keyFunc({
    type: 'property',
    property: 'home:kitchen',
    sub: ['object']
  })`, function() {
    const key = keyFunc({
      type: 'property',
      property: 'home:kitchen',
      sub: ['object']
    });

    const obj = {home: {kitchen: [{table: 'blue'}]}};
    const obj2 = {home: {kitchen: [{table: 'red'}]}};
    expect(key(obj)).to.equal(key(obj));
    expect(key(obj)).not.to.equal(key(obj2));
    expect(key(obj)).not.to.equal(key({home: {kitchen: [{table: 'blue'}]}}));
    expect(() => key({home: {livingRoom: [{table: 'blue'}]}}))
      .to.throw(ReferenceError,
      `Can't generate key for object with no property 'kitchen'`);
    expect(key(obj)).to.equal(signature(['1']));
  });

});
