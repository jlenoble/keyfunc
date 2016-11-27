import {expect} from 'chai';
import signature from 'sig';
import arrayFunc from '../src/arrayfunc';

describe(`Testing arrayFunc`, function() {

  it(`Calling arrayFunc()`,
  function() {
    const key = arrayFunc();

    expect(key([console])).to.equal(key([console]));
    expect(key([console, console])).to.equal(key([console, console]));

    expect(() => key(console)).to.throw(TypeError,
      'arr.map is not a function');

    expect(key([console, console])).not.to.equal(key([console]));
    expect(key([console])).not.to.equal(key([console, console]));

    const obj = {id: 1};
    expect(key([console, obj])).to.equal(key([console, obj]));
    expect(key([console, obj])).not.to.equal(key([console, {id: 1}]));
    expect(key([console, obj])).not.to.equal(key([obj, console]));

    expect(key([console, obj])).to.equal(signature(['1', '2']));
  });

  it(`Calling arrayFunc('key-')`,
  function() {
    const key = arrayFunc('key-');

    expect(key([console])).to.equal(key([console]));
    expect(key([console, console])).to.equal(key([console, console]));

    expect(() => key(console)).to.throw(TypeError,
      'arr.map is not a function');

    expect(key([console, console])).not.to.equal(key([console]));
    expect(key([console])).not.to.equal(key([console, console]));

    const obj = {id: 1};
    expect(key([console, obj])).to.equal(key([console, obj]));
    expect(key([console, obj])).not.to.equal(key([console, {id: 1}]));
    expect(key([console, obj])).not.to.equal(key([obj, console]));

    expect(key([console, obj])).to.equal('key-' + signature(['1', '2']));
  });

});
