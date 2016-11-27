import isString from 'is-string';
import signature from 'sig';
import strictFunc from './strictfunc';

export default function arrayFunc(stem, elementKeyFunc = strictFunc) {

  if (!isString(stem)) {
    stem = '';
  }

  return ((_stem, keyFunc) => {

    return arr => _stem + signature(arr.map(keyFunc).sort());

  })(stem, elementKeyFunc());

};
