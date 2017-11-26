import sig from 'sig';
import {expect} from 'chai';
import keyfunc from '../src/keyfunc';

describe('Backward compatibility with v0.8.2', function () {
  const keyFunc = keyfunc;
  const signature = sig;

  describe(`type 'property' with sub option`, function () {
    it(`Calling keyFunc({
      type: 'property',
      property: 'data',
      sub: {type: 'array', sub: ['object', 'object']}
    })`, function () {
        const key = keyFunc({
          type: 'property',
          property: 'data',
          sub: {type: 'array', sub: ['object', 'object']},
        });

        const o1 = {id: 1};
        const o2 = {id: 2};
        const obj = {data: [o1, o2]};
        expect(key(obj)).to.equal(key(obj));
        expect(key(obj)).to.equal(key({data: [o1, o2]}));
        expect(key(obj)).not.to.equal(key({data: [{id: 1}, o2]}));
        expect(key(obj)).not.to.equal(key({data: [o2, o1]}));
        expect(key(obj)).to.equal(signature([sig('o1o1')]));

        expect(() => key(obj, obj)).to.throw(
          Error, `Inconsistent number of arguments`);
      });

    it(`Calling keyFunc({
      type: 'property',
      property: 'data',
      sub: {type: 'array', sub: ['literal', 'literal']}
    })`, function () {
        const key = keyFunc({
          type: 'property',
          property: 'data',
          sub: {type: 'array', sub: ['literal', 'literal']},
        });

        const o1 = {id: 1};
        const o2 = {id: 2};
        const obj = {data: [o1, o2]};
        expect(key(obj)).to.equal(key(obj));
        expect(key(obj)).to.equal(key({data: [o1, o2]}));
        expect(key(obj)).to.equal(key({data: [{id: 1}, o2]}));
        expect(key(obj)).not.to.equal(key({data: [o2, o1]}));
        expect(key(obj)).to.equal(signature(
          [sig(signature(o1) + signature(o2))]));

        expect(() => key(obj, obj)).to.throw(
          Error, `Inconsistent number of arguments`);
      });

    it(`Calling keyFunc({
      type: 'property',
      sub: {type: 'array', sub: [
        {property: 'id'},
        {property: 'id'}
      ]},
      property: 'data'
    })`, function () {
        const key = keyFunc({
          type: 'property',
          property: 'data',
          sub: {type: 'array', sub: [
            {property: 'id'},
            {property: 'id'},
          ]},
        });

        const o1 = {id: 1};
        const o2 = {id: 2};
        const obj = {data: [o1, o2]};
        expect(key(obj)).to.equal(key(obj));
        expect(key(obj)).to.equal(key({data: [o1, o2]}));
        expect(key(obj)).to.equal(key({data: [{id: 1}, o2]}));
        expect(key(obj)).not.to.equal(key({data: [{id: 2}, o2]}));
        expect(key(obj)).not.to.equal(key({data: [o2, o1]}));
        expect(key(obj)).to.equal(signature(
          [sig(signature(1) + signature(2))]));

        expect(() => key(obj, obj)).to.throw(
          Error, `Inconsistent number of arguments`);
      });

    it(`Calling keyFunc({
      type: 'property',
      sub: ['array', 'array'],
      property: 'data'
    })`, function () {
        const key = keyFunc({
          type: 'property',
          sub: {type: 'array', sub: ['array', 'array']},
          property: 'data',
        });

        const o1 = {id: 1};
        const o2 = {id: 2};
        const obj = {data: [[o1], [o1, o2]]};
        expect(key(obj)).to.equal(key(obj));
        expect(key(obj)).to.equal(key({data: [[o1], [o1, o2]]}));
        expect(key(obj)).not.to.equal(key({data: [[{id: 1}], [o1, o2]]}));
        expect(key(obj)).not.to.equal(key({data: [[o1, o2], [o1]]}));
        expect(key(obj)).not.to.equal(key({data: [[o1], [o2, o1]]}));
        expect(key(obj)).to.equal(signature([
          sig(signature(['o1']) + signature(['o1', 'o2']))]));

        expect(() => key(obj, obj)).to.throw(
          Error, `Inconsistent number of arguments`);
      });

    it(`Calling keyFunc({
      type: 'property',
      sub: {type: 'array', sub: ['set', 'set']},
      property: 'data'
    })`, function () {
        const key = keyFunc({
          type: 'property',
          sub: {type: 'array', sub: ['set', 'set']},
          property: 'data',
        });

        const o1 = {id: 1};
        const o2 = {id: 2};
        const obj = {data: [[o1], [o1, o2]]};
        expect(key(obj)).to.equal(key(obj));
        expect(key(obj)).to.equal(key({data: [[o1], [o1, o2]]}));
        expect(key(obj)).not.to.equal(key({data: [[{id: 1}], [o1, o2]]}));
        expect(key(obj)).not.to.equal(key({data: [[o1, o2], [o1]]}));
        expect(key(obj)).to.equal(key({data: [[o1], [o2, o1]]}));
        expect(key(obj)).to.equal(signature([
          sig(signature(['o1']) + signature(['o1', 'o2']))]));

        expect(() => key(obj, obj)).to.throw(
          Error, `Inconsistent number of arguments`);
      });

    it(`Calling keyFunc({
      type: 'property',
      sub: {
        type: 'array',
        sub: [
          'object',
          'literal',
          {property: 'id'},
          'array:property:name',
          'set'
        ]
      },
      property: 'data'
    })`, function () {
        const key = keyFunc({
          type: 'property',
          sub: {
            type: 'array',
            sub: [
              'object',
              'literal',
              {property: 'id'},
              'array:property:name',
              'set',
            ],
          },
          property: 'data',
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
            [o1, o2, o3],
          ],
        };

        expect(key(obj)).to.equal(key(obj));
        expect(key(obj)).to.equal(key({data: [
          o1,
          {name: 'Karl'},
          {id: 1},
          [o3],
          [o1, o3, o2],
        ]}));
        expect(key(obj)).not.to.equal(key({data: [
          o1,
          o3,
          o2,
          [o3],
          [o1, {id: 1}, o3],
        ]}));
        expect(key(obj)).not.to.equal(key({data: [
          o1,
          o3,
          {id: 2},
          [o3],
          [o1, o2, o3],
        ]}));
        expect(key(obj)).to.equal(key({data: [
          o1,
          o3,
          o2,
          [{name: 'Karl'}],
          [o1, o2, o3],
        ]}));
        expect(key(obj)).not.to.equal(key({data: [
          o1,
          o3,
          o2,
          [{name: 'Poppy'}],
          [o1, o2, o3],
        ]}));

        expect(key(obj)).to.equal(signature([sig(`o1${signature(o3)}${
          signature(1)}${signature([signature('Karl')])}${
          signature(['o1', 'o2', 'o3'])}`)]));

        expect(() => key(obj, obj)).to.throw(
          Error, `Inconsistent number of arguments`);
      });

    it(`Calling keyFunc({
      type: 'property',
      sub: {
        type: 'array',
        sub: [
          'object',
          'literal',
          {property: 'id'},
          'array:property:name',
          'set'
        ]
      },
      property: 'data',
      rest: true
    })`, function () {
        const key = keyFunc({
          type: 'property',
          sub: {
            type: 'array',
            sub: [
              'object',
              'literal',
              {property: 'id'},
              'array:property:name',
              'set',
            ],
          },
          property: 'data',
          rest: true,
        });

        const o1 = {};
        const o2 = {id: 1};
        const o3 = {name: 'Karl'};

        const obj = {data: [
          o1,
          o3,
          o2,
          [o3],
          [o1, o2, o3],
        ]};

        expect(key(obj)).to.equal(key(obj));
        expect(() => key(obj, obj)).not.to.throw();
        expect(key(obj, obj)).to.equal(key(obj, obj));
        expect(key(obj, obj)).not.to.equal(key(obj, {data: [
          o3,
          o1,
          o2,
          [o3],
          [o1, o2, o3],
        ]}));
        expect(key(obj, obj)).to.equal(key(obj, {data: [
          o1,
          o3,
          o2,
          [o3],
          [o3, o2, o1],
        ]}));
        expect(key(obj, obj)).not.to.equal(key(obj, {data: [
          o1,
          o3,
          o2,
          [o3],
          [o1, {id: 1}, o3],
        ]}));
      });

    it(`Calling keyFunc({
      type: 'property',
      property: 'home:kitchen:table'
    })`, function () {
        const key = keyFunc({
          type: 'property',
          property: 'home:kitchen:table',
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
      sub: 'object'
    })`, function () {
        const key = keyFunc({
          type: 'property',
          property: 'home:kitchen',
          sub: 'object',
        });

        const obj = {home: {kitchen: {table: 'blue'}}};
        const obj2 = {home: {kitchen: {table: 'red'}}};
        expect(key(obj)).to.equal(key(obj));
        expect(key(obj)).not.to.equal(key(obj2));
        expect(key(obj)).not.to.equal(key({home: {kitchen: {table: 'blue'}}}));
        expect(() => key({home: {livingRoom: {table: 'blue'}}}))
          .to.throw(ReferenceError,
            `Can't generate key for object with no property 'kitchen'`);
        expect(key(obj)).to.equal('o1');
      });
  });
});
