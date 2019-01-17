import sig from 'sig';
import {expect} from 'chai';
import keyfunc from '../src/keyfunc';

describe('Backward compatibility with v0.8.2', function () {
  const keyFunc = keyfunc;
  const signature = sig;

  describe(`type 'array' with sub option`, function () {
    it(`Calling keyFunc({type: 'array', sub: ['object', 'object']})`,
      function () {
        const key = keyFunc({
          type: 'array',
          sub: ['object', 'object'],
        });

        const obj = {id: 1};
        expect(key([console, obj])).to.equal(key([console, obj]));
        expect(key([console, obj])).not.to.equal(key([obj, console]));
        expect(key([console, obj])).to.equal(signature([sig('o1o1')]));

        expect(() => key([console, obj], [obj, obj])).to.throw(
          Error, `Inconsistent number of arguments`);
      });

    it(`Calling keyFunc({type: 'array', sub: ['literal', 'literal']})`,
      function () {
        const key = keyFunc({
          type: 'array',
          sub: ['literal', 'literal'],
        });

        const obj = {id: 1};
        expect(key([console, obj])).to.equal(key([console, obj]));
        expect(key([console, obj])).not.to.equal(key([obj, console]));
        expect(key([console, obj])).to.equal(signature([
          signature(signature(console) + signature(obj))]));

        expect(() => key([console, obj], [obj, obj])).to.throw(
          Error, `Inconsistent number of arguments`);
      });

    it(`Calling keyFunc({type: 'array', sub: [
          {property: 'id'},
          {property: 'id'}
        ]})`, function () {
      const key = keyFunc({type: 'array', sub: [
        {property: 'id'},
        {property: 'id'},
      ]});

      const obj = {id: 1};
      const obj2 = {id: 2};
      expect(key([obj2, obj])).to.equal(key([obj2, obj]));
      expect(key([obj2, obj])).not.to.equal(key([obj, obj2]));
      expect(key([obj2, obj])).to.equal(signature([
        sig(signature(2) + signature(1))]));

      expect(() => key([obj2, obj], [obj, obj])).to.throw(
        Error, `Inconsistent number of arguments`);
    });

    it(`Calling keyFunc({type: 'array', sub: ['array', 'array']})`,
      function () {
        const key = keyFunc({type: 'array', sub: ['array', 'array']});

        const o1 = {};
        const o2 = {id: 1};
        const o3 = {name: 'Karl'};

        const obj = [o1, o2, o3];
        const obj2 = [o2, o3];

        expect(key([obj2, obj])).to.equal(key([obj2, obj]));
        expect(key([obj2, obj])).not.to.equal(key([obj, obj2]));
        expect(key([obj2, obj])).to.equal(signature([
          sig(signature(['o1', 'o2']) + signature(['o1', 'o2', 'o3'])),
        ]));

        expect(() => key([obj2, obj], [obj, obj])).to.throw(
          Error, `Inconsistent number of arguments`);
      });

    it(`Calling keyFunc({type: 'array', sub: ['set', 'set']})`, function () {
      const key = keyFunc({type: 'array', sub: ['set', 'set']});

      const o1 = {};
      const o2 = {id: 1};
      const o3 = {name: 'Karl'};

      const obj = [o1, o2, o3];
      const obj2 = [o2, o3];
      expect(key([obj2, obj])).to.equal(key([obj2, obj]));
      expect(key([obj2, obj])).not.to.equal(key([obj, obj2]));
      expect(key([obj2, obj])).to.equal(signature([
        sig(signature(['o1', 'o2']) + signature(['o1', 'o2', 'o3']))]));

      expect(() => key([obj2, obj], [obj, obj])).to.throw(
        Error, `Inconsistent number of arguments`);
    });

    it(`Calling keyFunc({type: 'array', sub: [
          'object',
          'literal',
          {property: 'id'},
          'array:property:name',
          'set'
        ]})`, function () {
      const key = keyFunc({type: 'array', sub: [
        'object',
        'literal',
        {property: 'id'},
        'array:property:name',
        'set',
      ]});

      const o1 = {};
      const o2 = {id: 1};
      const o3 = {name: 'Karl'};

      const obj = [
        o1,
        o3,
        o2,
        [o3],
        [o1, o2, o3],
      ];

      expect(key(obj)).to.equal(key(obj));
      expect(key(obj)).to.equal(key([
        o1,
        {name: 'Karl'},
        {id: 1},
        [o3],
        [o1, o3, o2],
      ]));
      expect(key(obj)).not.to.equal(key([
        o1,
        o3,
        o2,
        [o3],
        [o1, {id: 1}, o3],
      ]));
      expect(key(obj)).not.to.equal(key([
        o1,
        o3,
        {id: 2},
        [o3],
        [o1, o2, o3],
      ]));
      expect(key(obj)).to.equal(key([
        o1,
        o3,
        o2,
        [{name: 'Karl'}],
        [o1, o2, o3],
      ]));
      expect(key(obj)).not.to.equal(key([
        o1,
        o3,
        o2,
        [{name: 'Poppy'}],
        [o1, o2, o3],
      ]));

      expect(key(obj)).to.equal(signature([sig(`o1${signature(o3)}${
        signature(1)}${signature([signature('Karl')])}${
        signature(['o1', 'o2', 'o3'])}`)]));

      expect(() => key(obj, obj)).to.throw(
        Error, `Inconsistent number of arguments`);
    });

    it(`Calling keyFunc({type: 'array', sub: [
          'object',
          'literal',
          {property: 'id'},Backward compatibility with v0.8.2
          'array:property:name',
          'set'
        ], rest: true})`, function () {
      const key = keyFunc({
        type: 'array',
        sub: [
          'object',
          'literal',
          {property: 'id'},
          'array:property:name',
          'set',
        ],
        rest: true,
      });

      const o1 = {};
      const o2 = {id: 1};
      const o3 = {name: 'Karl'};

      const obj = [
        o1,
        o3,
        o2,
        [o3],
        [o1, o2, o3],
      ];

      expect(key(obj)).to.equal(key(obj));
      expect(() => key(obj, obj)).not.to.throw();
      expect(key(obj, obj)).to.equal(key(obj, obj));
      expect(key(obj, obj)).not.to.equal(key(obj, [
        o3,
        o1,
        o2,
        [o3],
        [o1, o2, o3],
      ]));
      expect(key(obj, obj)).to.equal(key(obj, [
        o1,
        o3,
        o2,
        [o3],
        [o3, o2, o1],
      ]));
      expect(key(obj, obj)).not.to.equal(key(obj, [
        o1,
        o3,
        o2,
        [o3],
        [o1, {id: 1}, o3],
      ]));
    });
  });

  it(`Calling keyFunc({type: 'set', sub: {
        type: 'array',
        sub: ['literal', 'literal'],
      }})`, function () {
    const key = keyfunc({type: 'set', sub: {
      type: 'array',
      sub: ['literal', 'literal'],
    }});

    const k1 = key([['David', 'Grey'], ['Philip', 'Strong'], ['Al',
      'Short'], ['Patrick', 'Barnes']]);
    const k2 = key([['David', 'Grey'], ['Philip', 'Strong'], ['Al',
      'Short'], ['Patrick', 'Barnes']]);
    const k3 = key([['Philip', 'Strong'], ['Al', 'Short'],
      ['David', 'Grey'], ['Patrick', 'Barnes']]);
    const k4 = key([['Philip', 'Strong'], ['Al', 'Short'], ['Al', 'Short'],
      ['David', 'Grey'], ['Patrick', 'Barnes'], ['Al', 'Short']]);

    expect(k1).to.equal(k2);
    expect(k1).to.equal(k3);
    expect(k1).to.equal(k4);
  });
});
