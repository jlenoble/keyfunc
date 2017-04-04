import {expect} from 'chai';
import sig from 'sig';
import keyfunc from '../src/keyfunc';

describe(`Testing 'array' hint`, function () {
  it(`Hint as string`, function () {
    const key = keyfunc('array');

    expect(key([console])).to.equal(key([console]));
    expect(key([console, console])).to.equal(key([console, console]));

    expect(() => key(console)).to.throw(TypeError,
      'Function can only generate keys for arrays');

    expect(key([console, console])).not.to.equal(key([console]));
    expect(key([console])).not.to.equal(key([console, console]));

    const obj = {id: 1};
    expect(key([console, obj])).to.equal(key([console, obj]));
    expect(key([console, obj])).not.to.equal(key([console, {id: 1}]));
    expect(key([console, obj])).not.to.equal(key([obj, console]));

    expect(key([console, obj])).to.equal(sig(['o1', 'o2']));
  });

  it(`Hint as option`, function () {
    const key = keyfunc({type: 'array'});

    expect(key([console])).to.equal(key([console]));
    expect(key([console, console])).to.equal(key([console, console]));

    expect(() => key(console)).to.throw(TypeError,
      'Function can only generate keys for arrays');

    expect(key([console, console])).not.to.equal(key([console]));
    expect(key([console])).not.to.equal(key([console, console]));

    const obj = {id: 1};
    expect(key([console, obj])).to.equal(key([console, obj]));
    expect(key([console, obj])).not.to.equal(key([console, {id: 1}]));
    expect(key([console, obj])).not.to.equal(key([obj, console]));

    expect(key([console, obj])).to.equal(sig(['o1', 'o2']));
  });

  it(`Hint as extended string 'array:literal'`, function () {
    const key = keyfunc('array:literal');

    expect(key([console])).to.equal(key([console]));
    expect(key([console, console])).to.equal(key([console, console]));

    expect(() => key(console)).to.throw(TypeError,
      'Function can only generate keys for arrays');

    expect(key([console, console])).not.to.equal(key([console]));
    expect(key([console])).not.to.equal(key([console, console]));

    const obj = {id: 1};
    expect(key([console, obj])).to.equal(key([console, obj]));
    expect(key([console, obj])).to.equal(key([console, {id: 1}]));
    expect(key([console, obj])).not.to.equal(key([obj, console]));

    expect(key([console, obj])).to.equal(sig([sig(console), sig(obj)]));
  });

  it(`Hint as extended string 'array:property:id'`, function () {
    const key = keyfunc('array:property:id');

    const obj = {id: 1};
    const obj2 = {id: 2};

    expect(key([obj2])).to.equal(key([obj2]));
    expect(key([obj2, obj2])).to.equal(key([obj2, obj2]));

    expect(() => key(obj2)).to.throw(TypeError,
      'Function can only generate keys for arrays');

    expect(key([obj2, obj2])).not.to.equal(key([obj2]));
    expect(key([obj2])).not.to.equal(key([obj2, obj2]));

    expect(key([obj2, obj])).to.equal(key([obj2, obj]));
    expect(key([obj2, obj])).to.equal(key([obj2, {id: 1}]));
    expect(key([obj2, obj])).not.to.equal(key([obj, obj2]));

    expect(key([obj2, obj])).to.equal(sig([sig(obj2.id), sig(obj.id)]));
  });

  it(`Hint as extended string 'array:array'`, function () {
    const key = keyfunc('array:array');

    const o1 = {};
    const o2 = {id: 1};
    const o3 = {name: 'Karl'};

    const obj = [o1, o2, o3];
    const obj2 = [o2, o3];

    expect(key([obj2])).to.equal(key([obj2]));
    expect(key([obj2, obj2])).to.equal(key([obj2, obj2]));

    expect(() => key(obj2)).to.throw(TypeError,
      'Function can only generate keys for arrays');

    expect(key([obj2, obj2])).not.to.equal(key([obj2]));
    expect(key([obj2])).not.to.equal(key([obj2, obj2]));

    expect(key([obj2, obj])).to.equal(key([obj2, obj]));
    expect(key([obj2, obj])).to.equal(key([obj2, [o1, o2, o3]]));
    expect(key([obj2, obj])).not.to.equal(key([[o3, o2], [o3, o2, o1]]));
    expect(key([obj2, obj])).not.to.equal(key([obj, obj2]));

    expect(key([obj2, obj])).to.equal(sig([
      sig(['o1', 'o2']),
      sig(['o3', 'o1', 'o2']), // First key'ed was o2, then o3, then o1
    ]));
  });

  it(`Hint as extended string 'array:set'`, function () {
    const key = keyfunc('array:set');

    const o1 = {};
    const o2 = {id: 1};
    const o3 = {name: 'Karl'};

    const obj = [o1, o2, o3];
    const obj2 = [o2, o3];

    expect(key([obj2])).to.equal(key([obj2]));
    expect(key([obj2, obj2])).to.equal(key([obj2, obj2]));

    expect(() => key(obj2)).to.throw(TypeError,
      'Function can only generate keys for sets');

    expect(key([obj2, obj2])).not.to.equal(key([obj2]));
    expect(key([obj2])).not.to.equal(key([obj2, obj2]));

    expect(key([obj2, obj])).to.equal(key([obj2, obj]));
    expect(key([obj2, obj])).to.equal(key([obj2, [o1, o2, o3]]));
    expect(key([obj2, obj])).to.equal(key([[o3, o2], [o3, o2, o1]]));
    expect(key([obj2, obj])).not.to.equal(key([obj, obj2]));

    expect(key([obj2, obj])).to.equal(sig([
      sig(['o1', 'o2']),
      sig(['o1', 'o2', 'o3']),
    ]));
  });

  it(`Multi args is invalid`, function () {
    const key = keyfunc('array');

    expect(() => key([console, console], [console, console])).to.throw(
      `Inconsistent number of arguments, can't generate key`);
  });

  describe('Backward compatibility with v0.8.2', function () {
    const keyFunc = keyfunc;
    const signature = sig;

    it(`Calling keyFunc('array:object')`, function () {
      const key = keyFunc('array:object');

      const obj = {id: 1};
      expect(key([console, obj])).to.equal(key([console, obj]));
      expect(key([console, obj])).not.to.equal(key([obj, console]));
      expect(key([console, obj])).to.equal(signature(['o1', 'o2']));
    });

    it(`Calling keyFunc('array:literal')`, function () {
      const key = keyFunc('array:literal');

      const obj = {id: 1};
      expect(key([console, obj])).to.equal(key([console, obj]));
      expect(key([console, obj])).not.to.equal(key([obj, console]));
      expect(key([console, obj])).to.equal(signature([
        signature(console), signature(obj),
      ]));
    });

    it(`Calling keyFunc('array:property:id')`, function () {
      const key = keyFunc('array:property:id');

      const obj = {id: 1};
      const obj2 = {id: 2};
      expect(key([obj2, obj])).to.equal(key([obj2, obj]));
      expect(key([obj2, obj])).not.to.equal(key([obj, obj2]));
      expect(key([obj2, obj])).to.equal(signature([
        signature(obj2.id), signature(obj.id),
      ]));
    });

    it(`Calling keyFunc('array:array')`, function () {
      const key = keyFunc('array:array');

      const o1 = {};
      const o2 = {id: 1};
      const o3 = {name: 'Karl'};

      const obj = [o1, o2, o3];
      const obj2 = [o2, o3];
      expect(key([obj2, obj])).to.equal(key([obj2, obj]));
      expect(key([obj2, obj])).not.to.equal(key([obj, obj2]));
      expect(key([obj2, obj])).to.equal(signature([
        signature(['o1', 'o2']),
        signature(['o3', 'o1', 'o2']),
      ]));
    });

    it(`Calling keyFunc('array:set')`, function () {
      const key = keyFunc('array:set');

      const o1 = {};
      const o2 = {id: 1};
      const o3 = {name: 'Karl'};

      const obj = [o1, o2, o3];
      const obj2 = [o2, o3];
      expect(key([obj2, obj])).to.equal(key([obj2, obj]));
      expect(key([obj2, obj])).not.to.equal(key([obj, obj2]));
      expect(key([obj2, obj])).to.equal(signature([
        signature(['o1', 'o2']),
        signature(['o1', 'o2', 'o3']),
      ]));
    });
  });
});
