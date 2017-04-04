import sig from 'sig';
import objectFunc from './object-func';

export default function arrayFunc (elementKeyfunc = objectFunc()) {
  return array => {
    try {
      return sig(array.map(arg => {
        return elementKeyfunc(arg);
        // used to be array => sig(array.map(elementKeyfunc))
        // but it breaks when elementKeyfunc is defined with a rest operator
        // because then the args passed to elementKeyFunc are (arg, i, array)
        // and elementKeyFunc may treat those as arg0, arg1, arg2 in some loop
      }));
    } catch (e) {
      if (e.message.match(/array.map is not a function/)) {
        throw new TypeError(`Function can only generate keys for arrays,
but argument was: ${JSON.stringify(array)}`);
      }
      throw e;
    }
  }
};
