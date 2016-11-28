import {expect} from 'chai';
import signature from 'sig';
import arrayFunc from '../src/arrayfunc';
import looseFunc from '../src/loosefunc';
import propertyFunc from '../src/propertyfunc';
import setFunc from '../src/setfunc';

describe(`Testing arrayFunc with elementKeyFunc arg`, function() {

  [
    undefined,
    'key-'
  ].forEach(function(_key) {

    it(`Calling arrayFunc(${_key}, looseFunc())`,
    function() {
      const key = arrayFunc(_key, looseFunc());

      expect(key([console])).to.equal(key([console]));
      expect(key([console, console])).to.equal(key([console, console]));

      expect(() => key(console)).to.throw(TypeError,
        'arr.map is not a function');

      expect(key([console, console])).not.to.equal(key([console]));
      expect(key([console])).not.to.equal(key([console, console]));

      const obj = {id: 1};
      expect(key([console, obj])).to.equal(key([console, obj]));
      expect(key([console, obj])).to.equal(key([console, {id: 1}]));
      expect(key([console, obj])).not.to.equal(key([obj, console]));

      expect(key([console, obj])).to.equal((_key ? _key : '') +
        signature([signature(console), signature(obj)]));
    });

    it(`Calling arrayFunc(${_key}, propertyFunc('id'))`,
    function() {
      const key = arrayFunc(_key, propertyFunc('id'));

      const obj = {id: 1};
      const obj2 = {id: 2};

      expect(key([obj2])).to.equal(key([obj2]));
      expect(key([obj2, obj2])).to.equal(key([obj2, obj2]));

      expect(() => key(obj2)).to.throw(TypeError,
        'arr.map is not a function');

      expect(key([obj2, obj2])).not.to.equal(key([obj2]));
      expect(key([obj2])).not.to.equal(key([obj2, obj2]));

      expect(key([obj2, obj])).to.equal(key([obj2, obj]));
      expect(key([obj2, obj])).to.equal(key([obj2, {id: 1}]));
      expect(key([obj2, obj])).not.to.equal(key([obj, obj2]));

      expect(key([obj2, obj])).to.equal((_key ? _key : '') +
        signature([signature(obj2.id), signature(obj.id)]));
    });

    it(`Calling arrayFunc(${_key}, arrayFunc())`,
    function() {
      const key = arrayFunc(_key, arrayFunc());

      const o1 = {};
      const o2 = {id: 1};
      const o3 = {name: 'Karl'};

      const obj = [o1, o2, o3];
      const obj2 = [o2, o3];

      expect(key([obj2])).to.equal(key([obj2]));
      expect(key([obj2, obj2])).to.equal(key([obj2, obj2]));

      expect(() => key(obj2)).to.throw(TypeError,
        'arr.map is not a function');

      expect(key([obj2, obj2])).not.to.equal(key([obj2]));
      expect(key([obj2])).not.to.equal(key([obj2, obj2]));

      expect(key([obj2, obj])).to.equal(key([obj2, obj]));
      expect(key([obj2, obj])).to.equal(key([obj2, [o1, o2, o3]]));
      expect(key([obj2, obj])).not.to.equal(key([[o3, o2], [o3, o2, o1]]));
      expect(key([obj2, obj])).not.to.equal(key([obj, obj2]));

      expect(key([obj2, obj])).to.equal((_key ? _key : '') +
        signature([
          signature(['1', '2']),
          signature(['3', '1', '2']) // First key'ed was o2, then o3, then o1
        ]));
    });

    it(`Calling arrayFunc(${_key}, setFunc())`,
    function() {
      const key = arrayFunc(_key, setFunc());

      const o1 = {};
      const o2 = {id: 1};
      const o3 = {name: 'Karl'};

      const obj = [o1, o2, o3];
      const obj2 = [o2, o3];

      expect(key([obj2])).to.equal(key([obj2]));
      expect(key([obj2, obj2])).to.equal(key([obj2, obj2]));

      expect(() => key(obj2)).to.throw(TypeError,
        'arr.map is not a function');

      expect(key([obj2, obj2])).not.to.equal(key([obj2]));
      expect(key([obj2])).not.to.equal(key([obj2, obj2]));

      expect(key([obj2, obj])).to.equal(key([obj2, obj]));
      expect(key([obj2, obj])).to.equal(key([obj2, [o1, o2, o3]]));
      expect(key([obj2, obj])).to.equal(key([[o3, o2], [o3, o2, o1]]));
      expect(key([obj2, obj])).not.to.equal(key([obj, obj2]));

      expect(key([obj2, obj])).to.equal((_key ? _key : '') +
        signature([
          signature(['1', '2']),
          signature(['1', '2', '3'])
        ]));
    });

  });

});
