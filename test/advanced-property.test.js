import {expect} from 'chai';
import signature from 'sig';
import arrayFunc from '../src/arrayfunc';
import strictFunc from '../src/strictfunc';
import propertyFunc from '../src/propertyfunc';
import setFunc from '../src/setfunc';

describe(`Testing propertyFunc with propertyKeyFunc arg`, function () {
  [
    undefined,
    'key-',
  ].forEach(function (_key) {
    it(`Calling propertyFunc('data',${_key}, strictFunc())`,
    function () {
      const key = propertyFunc('data', _key, strictFunc());

      const o = {id: 1};
      const o2 = {id: 1};
      const obj = {data: o};
      const obj2 = {data: o2};

      expect(key(obj)).to.equal(key(obj));
      expect(key(obj)).not.to.equal(key(obj2));

      expect(key(obj)).to.equal((_key ? _key : '') + '1');
      expect(key(obj2)).to.equal((_key ? _key : '') + '2');
    });

    it(`Calling propertyFunc('data',${_key}, propertyFunc('id'))`,
    function () {
      const key = propertyFunc('data', _key, propertyFunc('id'));

      const o = {id: 1};
      const o2 = {id: 1};
      const obj = {data: o};
      const obj2 = {data: o2};

      expect(key(obj)).to.equal(key(obj));
      expect(key(obj)).to.equal(key(obj2));
      expect(key(obj)).not.to.equal(key({data: {id: 2}}));

      expect(key(obj)).to.equal((_key ? _key : '') + signature(1));
    });

    it(`Calling propertyFunc('data',${_key}, arrayFunc())`,
    function () {
      const key = propertyFunc('data', _key, arrayFunc());

      const o = {id: 1};
      const o2 = {id: 1};
      const obj = {data: [o]};
      const obj2 = {data: [o, o2]};

      expect(key(obj)).to.equal(key(obj));
      expect(key(obj)).not.to.equal(key(obj2));
      expect(key(obj)).to.equal(key({data: [o]}));

      expect(key(obj2)).to.equal(key({data: [o, o2]}));
      expect(key(obj2)).not.to.equal(key({data: [o2, o]}));

      expect(key(obj)).to.equal((_key ? _key : '') + signature(['1']));
      expect(key(obj2)).to.equal((_key ? _key : '') + signature(['1', '2']));
      expect(key({data: [o2, o]})).to.equal((_key ? _key : '') +
        signature(['2', '1']));
    });

    it(`Calling propertyFunc('data',${_key}, arrayFunc())`,
    function () {
      const key = propertyFunc('data', _key, setFunc());

      const o = {id: 1};
      const o2 = {id: 1};
      const obj = {data: [o]};
      const obj2 = {data: [o, o2]};

      expect(key(obj)).to.equal(key(obj));
      expect(key(obj)).not.to.equal(key(obj2));
      expect(key(obj)).to.equal(key({data: [o]}));

      expect(key(obj2)).to.equal(key({data: [o, o2]}));
      expect(key(obj2)).to.equal(key({data: [o2, o]}));

      expect(key(obj)).to.equal((_key ? _key : '') + signature(['1']));
      expect(key(obj2)).to.equal((_key ? _key : '') + signature(['1', '2']));
    });
  });
});
