import isString from 'is-string';
import signature from 'sig';
import strictFunc from './strictfunc';

export default function arrayFunc(stem) {

  if (!isString(stem)) {
    stem = '';
  }

  return (_strictFunc => {

    return arr => signature(arr.map(_strictFunc).sort());

  })(strictFunc(stem));

};
