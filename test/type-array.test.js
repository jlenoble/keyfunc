import {expect} from 'chai';
import sig from 'sig';
import keyfunc from '../src/keyfunc';

describe(`Testing 'array' hint`, function () {
  it(`Hint as string`, function () {
    const key = keyfunc('array');

    expect(key([console])).to.equal(key([console]));
    expect(key([console, console])).to.equal(key([console, console]));

    expect(() => key(console)).to.throw(TypeError,
      'array.map is not a function');

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
      'array.map is not a function');

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
      'array.map is not a function');

    expect(key([console, console])).not.to.equal(key([console]));
    expect(key([console])).not.to.equal(key([console, console]));

    const obj = {id: 1};
    expect(key([console, obj])).to.equal(key([console, obj]));
    expect(key([console, obj])).to.equal(key([console, {id: 1}]));
    expect(key([console, obj])).not.to.equal(key([obj, console]));

    expect(key([console, obj])).to.equal(sig([sig(console), sig(obj)]));
  });
});