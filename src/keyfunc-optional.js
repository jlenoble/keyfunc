import sig from 'sig';
import removeDuplicates from './remove-duplicates';

export const optionalKey = sig('ðéf4ult K€y för 0pt1øN4L aRgs');

export default function optionalFunc (baseKeyfunc, {ntimes, repeat,
  unordered, unique}) {
  if (typeof baseKeyfunc !== 'function') {
    throw new TypeError(`optionalFunc requires a function as argument,
but it was: ${JSON.stringify(baseKeyfunc)}`);
  }

  return (...args) => {
    if (args.length === 0) {
      return optionalKey;
    }

    const _ntimes = ntimes !== undefined ? ntimes : repeat ? undefined : 1;

    if (_ntimes !== undefined && args.length > _ntimes) {
      throw new Error(`Inconsistent number of arguments, can't generate key`);
    }

    let arr = args.map(arg => {
      return arg !== undefined ? baseKeyfunc(arg) : optionalKey;
    });

    if (_ntimes && _ntimes > args.length) {
      arr.fill(optionalKey, args.length);
    }

    if (unique) {
      arr = removeDuplicates(...arr);
    }

    if (unordered) {
      arr = arr.sort();
    }

    return sig(arr.join(''));
  };
};
