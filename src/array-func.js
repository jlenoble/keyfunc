import sig from 'sig';
import objectFunc from './object-func';

export default function arrayFunc (elementKeyfunc = objectFunc()) {
  return array => sig(array.map(arg => {
    return elementKeyfunc(arg);
    // used to be array => sig(array.map(elementKeyfunc))
    // but it breaks when elementKeyfunc is defined with a rest operator
    // because then the args passed to elementKeyFunc are (arg, i, array)
    // and elementKeyFunc may treat those as arg0, arg1, arg2 in some loop
  }));
};
