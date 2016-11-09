import isString from 'is-string';
import signature from 'sig';

export default function strictFunc(stem) {

  if (!isString(stem)) {
    stem = '';
  }

  return (stem => {
    return obj => {
      return stem + signature(obj);
    };
  })(stem);

};
