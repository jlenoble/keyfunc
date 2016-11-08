import {expect} from 'chai';
import keyFunc from '../src/keyfunc';

describe('Testing idType option', function() {

  it(`String type option along with idProperty option is ok` , function() {
    const key = keyFunc({
      idProperty: 'name',
      type: String
    });
    const named1 = {name: 'Albert'};
    const named2 = {name: 'Beth'};
    const named3 = {name: 'Carole'};
    expect(key(named1)).to.equal('keyAlbert');
    expect(key(named2)).to.equal('keyBeth');
    expect(key(named3)).to.equal('keyCarole');
    expect(() => key({title: 'Denis'})).to.throw(ReferenceError);
    expect(() => key({name: 12})).to.throw(TypeError);
  });

  it(`String type option along with stem option is ok` , function() {
    const key = keyFunc({
      stem: 'name',
      type: String
    });
    const named1 = 'Albert';
    const named2 = 'Beth';
    const named3 = 'Carole';
    expect(key(named1)).to.equal('nameAlbert');
    expect(key(named2)).to.equal('nameBeth');
    expect(key(named3)).to.equal('nameCarole');
    expect(() => key({name: 12})).to.throw(TypeError);
  });

  it(`Number type option along with idProperty/stem options is ok` ,
    function() {
    const key = keyFunc({
      idProperty: 'cid',
      type: Number,
      stem: 'c'
    });
    const c1 = {cid: 1};
    const c2 = {cid: 25};
    const c3 = {cid: 14};
    expect(key(c1)).to.equal('c1');
    expect(key(c2)).to.equal('c25');
    expect(key(c3)).to.equal('c14');
    expect(() => key({title: 'Denis'})).to.throw(ReferenceError);
    expect(() => key({cid: 'Erica'})).to.throw(TypeError);
  });

  it(`Object type option along idProperty option is ok` , function() {
    const key = keyFunc({
      type: Object,
      idProperty: 'cid'
    });
    const o1 = {cid: {a: 1}};
    const o2 = {cid: {a: 2}};
    const o3 = {cid: {a: 3}};
    expect(key(o1)).to.equal('key1');
    expect(key(o2)).to.equal('key2');
    expect(key(o3)).to.equal('key3');
    expect(() => key(12)).to.throw(ReferenceError);
    expect(() => key([])).to.throw(ReferenceError);
    expect(() => key('Denis')).to.throw(ReferenceError);
  });

  it(`Object type option along stem option is ok` , function() {
    const key = keyFunc({
      type: Object,
      stem: 'c'
    });
    const o1 = {cid: 1};
    const o2 = {cid: 25};
    const o3 = {cid: 14};
    expect(key(o1)).to.equal('c1');
    expect(key(o2)).to.equal('c2');
    expect(key(o3)).to.equal('c3');
    expect(() => key(12)).to.throw(TypeError);
    expect(() => key([])).to.throw(TypeError);
    expect(() => key('Denis')).to.throw(TypeError);
  });

  it(`Array type option along stem option is ok` , function() {
    const key = keyFunc({
      type: Array,
      stem: 'a'
    });
    const a1 = [1, 2, 3];
    const a2 = [2, 3, 4];
    const a3 = [3, 4, 5];
    expect(key(a1)).to.equal('a1');
    expect(key(a2)).to.equal('a2');
    expect(key(a3)).to.equal('a3');
    expect(() => key(12)).to.throw(TypeError);
    expect(() => key({})).to.throw(TypeError);
    expect(() => key('Denis')).to.throw(TypeError);
  });

});
