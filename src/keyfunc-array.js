import sig from 'sig';
import objectFunc from './keyfunc-object';
import removeDuplicates from './remove-duplicates';

export default function arrayFunc (elementKeyfunc = objectFunc(),
  options = {}) {
  const {unordered, unique, ntimes, spread} = options;

  // used to be array => sig(array.map(elementKeyfunc))
  // but it breaks when elementKeyfunc is defined with a rest operator
  // because then the args passed to elementKeyFunc are (arg, i, array)
  // and elementKeyFunc may treat those as arg0, arg1, arg2 in some loop
  return array => {
    try {
      if (ntimes && array.length !== ntimes) {
        throw new Error(`Inconsistent number of elements, can't generate key`);
      }

      let arr = array;

      if (spread) {
        return sig([elementKeyfunc(...arr)]);
      }

      arr = arr.map(arg => {
        return elementKeyfunc(arg);
      });

      if (unique) {
        arr = removeDuplicates(...arr);
      }

      if (unordered) {
        arr = arr.sort();
      }

      return sig(arr);
    } catch (e) {
      if (e.message.match(/arr.map is not a function/)) {
        throw new TypeError(`Function can only generate keys for ${unique ?
          'sets' : 'arrays'}, but argument was: ${JSON.stringify(array)}`);
      }
      throw e;
    }
  };
};
