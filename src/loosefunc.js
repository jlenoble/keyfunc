import isString from 'is-string';
import signature from 'sig';

export default function strictFunc (_stem) {
  const stem = isString(_stem) ? _stem : '';

  return (stem => {
    return obj => {
      return stem + signature(obj);
    };
  })(stem);
};
