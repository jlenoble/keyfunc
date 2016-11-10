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

  return (function(keyFuncs, args) {
    const max = keyFuncs.length - 1;
    let rest = 0;

    while (rest <= max) {
      if (args[rest].rest) {
        break;
      }
      rest++;
    }

    return function(...args) {

      return args.map((arg, i) => {
        if (i <= max) {
          return keyFuncs[i](arg);
        } else {
          if (rest > max) {
            throw new Error(`Too many arguments, can't generate key`);
          }
          return keyFuncs[rest](arg);
        }
      }).join('_');

    };

  })(args.map(func), args);

};
