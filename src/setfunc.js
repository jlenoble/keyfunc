import isString from 'is-string';
import signature from 'sig';
import strictFunc from './strictfunc';

export default function arrayFunc(stem) {

  if (!isString(stem)) {
    stem = '';
  }

  return ((_stem, _strictFunc) => {

    return arr => _stem + signature(arr.map(_strictFunc).sort());

  })(stem, strictFunc(stem));

};
