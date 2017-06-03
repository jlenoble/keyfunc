import {expect} from 'chai';
import sig from 'sig';
import keyfunc, {optionalKey} from '../src/keyfunc';

describe(`Testing option optional`, function () {
  it('Single arg', function () {
    const key = keyfunc({
      type: 'literal',
      optional: true,
    });

    const o1 = {id: 1};
    const o2 = {id: 2};

    expect(key(o1)).to.equal(key(o1));
    expect(key(o1)).to.equal(sig(sig(o1)));

    expect(() => key()).not.to.throw();
    expect(key()).to.equal(optionalKey);

    expect(() => key(o1, o2)).to.throw(
      `Inconsistent number of arguments, can't generate key`);
  });

  it('In list of args', function () {
    const key = keyfunc('object', {
      type: 'literal',
      optional: true,
    }, 'ignore');

    const o1 = {id: 1};
    const o2 = {id: 2};
    const o3 = {id: 3};

    expect(key(o1, o2, o3)).to.equal(key(o1, o2, o1));
    expect(key(o1, o2, o3)).to.equal(key(o1, o2));
    expect(key(o1, o2, o3)).not.to.equal(key(o1, o3));

    expect(() => key(o1)).not.to.throw();

    expect(key(o1)).not.to.equal(key(o1, o2));
    expect(key(o1)).to.equal(sig('o1' + optionalKey));
  });

  it('In arrays', function () {
    const key = keyfunc({
      type: 'array',
      sub: ['object', {
        type: 'literal',
        optional: true,
      }, 'ignore'],
    });

    const o1 = {id: 1};
    const o2 = {id: 2};
    const o3 = {id: 3};

    expect(key([o1, o2, o3])).to.equal(key([o1, o2, o1]));
    expect(key([o1, o2, o3])).to.equal(key([o1, o2]));
    expect(key([o1, o2, o3])).not.to.equal(key([o1, o3]));

    expect(() => key([o1])).not.to.throw();

    expect(key([o1])).not.to.equal(key([o1, o2]));
    expect(key([o1])).to.equal(sig([sig('o1' + optionalKey)]));
  });

  it(`Testing deep identity with type option 'option'`, function () {
    const key = keyfunc({
      type: 'option',
      sub: {
        name: 'literal',
        fn: {type: 'object', optional: true},
      },
    });

    const obj = {
      name: 'Albert',
      fn: console.error,
    };

    expect(key(obj)).to.equal(key(obj));
    expect(key(obj)).to.equal(key({name: 'Albert', fn: console.error}));
    expect(key(obj)).to.equal(key({name: 'Albert', fn: console.error,
      dummy: 'dummy'}));

    expect(key(obj)).not.to.equal(key({name: 'Albert', fn: console.log}));
    expect(key(obj)).not.to.equal(key({name: 'Frida', fn: console.error}));

    expect(() => key({name: 'Albert'})).not.to.throw();
    expect(key(obj)).not.to.equal(key({name: 'Albert'})); // fn optional, but
    // not ignored

    expect(key(obj)).to.equal(sig({
      name: sig('Albert'),
      fn: sig('o1'),
    }));
    expect(key({name: 'Albert'})).to.equal(sig({
      name: sig('Albert'),
      fn: sig(optionalKey),
    }));

    expect(() => key(obj, obj)).to.throw(
      Error, `Inconsistent number of arguments`);
  });

  it('Several trailing optional arguments', function () {
    const key = keyfunc('object', {
      type: 'object',
      optional: true,
    }, {
      type: 'object',
      optional: true,
      ntimes: 3,
    }, {
      type: 'object',
      optional: true,
    });

    const o1 = {id: 1};
    const o2 = {id: 2};
    const o3 = {id: 3};
    const o4 = {id: 4};
    const o5 = {id: 5};
    const o6 = {id: 6};
    const o7 = {id: 7};

    expect(() => key()).to.throw(
      `Inconsistent number of arguments, can't generate key`);
    expect(() => key(o1)).not.to.throw();
    expect(() => key(o1, o2)).not.to.throw();
    expect(() => key(o1, o2, o3)).not.to.throw();
    expect(() => key(o1, o2, o3, o4)).not.to.throw();
    expect(() => key(o1, o2, o3, o4, o5)).not.to.throw();
    expect(() => key(o1, o2, o3, o4, o5, o6)).not.to.throw();
    expect(() => key(o1, o2, o3, o4, o5, o6, o7)).to.throw(
      `Inconsistent number of arguments, can't generate key`);
  });

  it(`option optional on type set:set (bugfix)`, function () {
    class Class {
      constructor (name) {
        this.name = name;
      }
    }

    const key = keyfunc('array:literal', {property: 'name'},
      {type: 'set:set', optional: true});
    const ref = keyfunc('array:literal', {property: 'name'},
      {type: 'set:set'});

    const c1 = new Class('Adele');
    const c2 = new Class('Bea');
    const c3 = new Class('Cecil');

    const s1 = key(
      [c1, c2, c3],
      c3,
      [[c1], [c2, c3]]
    );
    const s0 = ref(
      [c1, c2, c3],
      c3,
      [[c1], [c2, c3]]
    );

    expect(s0).to.equal(ref(
      [c1, c2, c3],
      c3,
      [[c1], [c2, c3]]
    ));

    expect(s1).to.equal(key(
      [c1, c2, c3],
      c3,
      [[c1], [c2, c3]]
    ));
    expect(s1).to.equal(key(
      [c1, {name: 'Bea'}, c3],
      {name: 'Cecil'},
      [[c1], [c3, c2]]
    ));
  });
});
