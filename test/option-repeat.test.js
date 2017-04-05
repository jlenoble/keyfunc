import {expect} from 'chai';
import keyfunc, {optionalKey} from '../src/keyfunc';
import sig from 'sig';

describe(`Testing option repeat`, function () {
  it(`Single 'object' type`,
  function () {
    const key = keyfunc({type: 'object', repeat: true});

    const o1 = {id: 1};
    const o2 = {id: 2};
    const o3 = {id: 3};
    const o4 = {id: 4};
    const o5 = {id: 5};

    expect(() => key()).to.throw(
      `Inconsistent number of arguments, can't generate key`);
    expect(() => key(o1)).not.to.throw();
    expect(() => key(o1, o2)).not.to.throw();
    expect(() => key(o1, o2, o3)).not.to.throw();
    expect(() => key(o1, o2, o3, o4)).not.to.throw();
    expect(() => key(o1, o2, o3, o4, o5)).not.to.throw();

    expect(key(o1)).to.equal('o1');
    expect(key(o1, o2)).to.equal(sig('o1o2'));
    expect(key(o1, o2, o3)).to.equal(sig('o1o2o3'));
    expect(key(o1, o2, o3, o4)).to.equal(sig('o1o2o3o4'));
    expect(key(o1, o2, o3, o4, o5)).to.equal(sig('o1o2o3o4o5'));
  });

  it(`Single 'literal' type`,
  function () {
    const key = keyfunc({type: 'literal', repeat: true});

    const o1 = {id: 1};
    const o2 = {id: 2};
    const o3 = {id: 3};
    const o4 = {id: 4};
    const o5 = {id: 5};

    expect(() => key()).to.throw(
      `Inconsistent number of arguments, can't generate key`);
    expect(() => key(o1)).not.to.throw();
    expect(() => key(o1, o2)).not.to.throw();
    expect(() => key(o1, o2, o3)).not.to.throw();
    expect(() => key(o1, o2, o3, o4)).not.to.throw();
    expect(() => key(o1, o2, o3, o4, o5)).not.to.throw();

    expect(key(o1)).to.equal(sig(o1));
    expect(key(o1, o2)).to.equal(sig(sig(o1) + sig(o2)));
    expect(key(o1, o2, o3)).to.equal(sig(sig(o1) + sig(o2) + sig(o3)));
    expect(key(o1, o2, o3, o4)).to.equal(sig(
      sig(o1) + sig(o2) + sig(o3) + sig(o4)));
    expect(key(o1, o2, o3, o4, o5)).to.equal(sig(
      sig(o1) + sig(o2) + sig(o3) + sig(o4) + sig(o5)));
  });

  it(`Multiple repeat without ntimes is meaningless`,
  function () {
    expect(() => keyfunc(
      {type: 'literal', repeat: true},
      {type: 'object', repeat: true}
    )).to.throw('Only last hint may have option repeat');
  });

  it(`Multiple repeat with ntimes except last is fine`,
  function () {
    let key;
    expect(() => {
      key = keyfunc(
        {type: 'literal', repeat: true, ntimes: 2},
        {type: 'object', repeat: true}
      );
    }).not.to.throw();

    const o1 = {id: 1};
    const o2 = {id: 2};
    const o3 = {id: 3};
    const o4 = {id: 4};
    const o5 = {id: 5};

    expect(() => key()).to.throw(
      `Inconsistent number of arguments, can't generate key`);
    expect(() => key(o1)).to.throw(
      `Inconsistent number of arguments, can't generate key`);
    expect(() => key(o1, o2)).to.throw(
      `Inconsistent number of arguments, can't generate key`);
    expect(() => key(o1, o2, o3)).not.to.throw();
    expect(() => key(o1, o2, o3, o4)).not.to.throw();
    expect(() => key(o1, o2, o3, o4, o5)).not.to.throw();

    expect(key(o1, o2, o3)).to.equal(sig(sig(sig(o1) + sig(o2)) + 'o1'));
    expect(key(o1, o2, o3, o4)).to.equal(sig(sig(sig(o1) + sig(o2)) +
      sig('o1o2')));
    expect(key(o1, o2, o3, o4, o5)).to.equal(sig(sig(sig(o1) + sig(o2)) +
      sig('o1o2o3')));
  });

  it(`Multiple repeat with ntimes except last + last optional option is fine`,
  function () {
    let key;
    expect(() => {
      key = keyfunc(
        {type: 'literal', repeat: true, ntimes: 2},
        {type: 'object', repeat: true, optional: true}
      );
    }).not.to.throw();

    const o1 = {id: 1};
    const o2 = {id: 2};
    const o3 = {id: 3};
    const o4 = {id: 4};
    const o5 = {id: 5};

    expect(() => key()).to.throw(
      `Inconsistent number of arguments, can't generate key`);
    expect(() => key(o1)).to.throw(
      `Inconsistent number of arguments, can't generate key`);
    expect(() => key(o1, o2)).not.to.throw();
    expect(() => key(o1, o2, o3)).not.to.throw();
    expect(() => key(o1, o2, o3, o4)).not.to.throw();
    expect(() => key(o1, o2, o3, o4, o5)).not.to.throw();

    expect(key(o1, o2)).to.equal(sig(sig(sig(o1) + sig(o2)) + optionalKey));
    expect(key(o1, o2, o3)).to.equal(sig(sig(sig(o1) + sig(o2)) + 'o1'));
    expect(key(o1, o2, o3, o4)).to.equal(sig(sig(sig(o1) + sig(o2)) +
      sig('o1o2')));
    expect(key(o1, o2, o3, o4, o5)).to.equal(sig(sig(sig(o1) + sig(o2)) +
      sig('o1o2o3')));
  });

  it(`Multiple repeat with ntimes + last optional option is fine`,
  function () {
    let key;
    expect(() => {
      key = keyfunc(
        {type: 'literal', repeat: true, ntimes: 2},
        {type: 'object', repeat: true, ntimes: 2, optional: true}
      );
    }).not.to.throw();

    const o1 = {id: 1};
    const o2 = {id: 2};
    const o3 = {id: 3};
    const o4 = {id: 4};
    const o5 = {id: 5};

    expect(() => key()).to.throw(
      `Inconsistent number of arguments, can't generate key`);
    expect(() => key(o1)).to.throw(
      `Inconsistent number of arguments, can't generate key`);
    expect(() => key(o1, o2)).not.to.throw();
    expect(() => key(o1, o2, o3)).not.to.throw();
    expect(() => key(o1, o2, o3, o4)).not.to.throw();
    expect(() => key(o1, o2, o3, o4, o5)).to.throw(
      `Inconsistent number of arguments, can't generate key`);

    expect(key(o1, o2)).to.equal(sig(sig(sig(o1) + sig(o2)) + optionalKey));
    expect(key(o1, o2, o3)).to.equal(sig(sig(sig(o1) + sig(o2)) + 'o1'));
    expect(key(o1, o2, o3, o4)).to.equal(sig(sig(sig(o1) + sig(o2)) +
      sig('o1o2')));
  });
});
