import {expect} from 'chai';
import signature from 'sig';
import setFunc from '../src/setfunc';

describe(`Testing setFunc`, function() {

  it(`Calling setFunc()`,
  function() {
    const key = setFunc();

    expect(key([console])).to.equal(key([console]));
    expect(key([console, console])).to.equal(key([console, console]));

    expect(() => key(console)).to.throw(TypeError,
      'arr.map is not a function');

    expect(key([console, console])).not.to.equal(key([console]));
    expect(key([console])).not.to.equal(key([console, console]));

    const obj = {id: 1};
    expect(key([console, obj])).to.equal(key([console, obj]));
    expect(key([console, obj])).not.to.equal(key([console, {id: 1}]));

    expect(key([console, obj])).to.equal(key([obj, console]));
    expect(key([console, obj])).to.equal(signature(['1', '2']));
  });

  it(`Calling setFunc('key-')`,
  function() {
    const key = setFunc('key-');

    expect(key([console])).to.equal(key([console]));
    expect(key([console, console])).to.equal(key([console, console]));

    expect(() => key(console)).to.throw(TypeError,
      'arr.map is not a function');

    expect(key([console, console])).not.to.equal(key([console]));
    expect(key([console])).not.to.equal(key([console, console]));

    const obj = {id: 1};
    expect(key([console, obj])).to.equal(key([console, obj]));
    expect(key([console, obj])).not.to.equal(key([console, {id: 1}]));

    expect(key([console, obj])).to.equal(key([obj, console]));
    expect(key([console, obj])).to.equal('key-' +
      signature(['1', '2']));
  });

});
