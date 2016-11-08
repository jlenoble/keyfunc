import isString from 'is-string';
import objectFunc from './objectfunc';

export default function keyFunc(...args) {

  const func = option => {

    if (isString(option)) {
      option = {
        type: option
      };
    }

    if (option.property) {
      option.type = 'property';
    }

    return objectFunc(option.type, option);

  };

  return (function(keyFuncs) {
    const max = keyFuncs.length - 1;

    return function(...args) {

      return args.map((arg, i) => {
        return keyFuncs[i < max ? i : max](arg);
      }).join('_');

    };

  })(args.map(func));

};
