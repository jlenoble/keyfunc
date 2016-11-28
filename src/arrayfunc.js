import isString from 'is-string';
import signature from 'sig';
import strictFunc from './strictfunc';

export default function arrayFunc(stem, elementKeyFunc = strictFunc()) {

  if (!isString(stem)) {
    stem = '';
  }

  return ((_stem, keyFunc) => {
    return arr => _stem + signature(arr.map(arg => {
      return keyFunc(arg);
      // used to be arr => _stem + signature(arr.map(keyFunc))
      // but it breaks when keyFunc is defined with a rest operator
      // because then the args passed to keyFunc are (arg, i, arr)
      // and keyFunc may treat those as arg0, arg1, arg2 in some loop
    }));
  })(stem, elementKeyFunc);

};
