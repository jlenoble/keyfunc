import isString from 'is-string';
import objectFunc from './objectfunc';
import signature from 'sig';

export default function keyFunc(...args) {

  const func = option => {

    if (isString(option)) {
      option = {
        type: option
      };
    }

    if (option.property && !option.type) {
      option.type = 'property';
    }

    if (option.sub) {
      if (option.type === 'array') {
        return (function(stem, key) {
          return function(args) {
            return stem + signature([key(...args)]);
          };
        }(option.stem ? option.stem : '', keyFunc(...option.sub)));
      } else if (option.type === 'property') {
        return (function(stem, prop, key) {
          return function(args) {
            args = [args, ...prop.split(':')].reduce((obj, ppty) => {
              if (!obj[ppty]) {
                throw new ReferenceError(
                  `Can't generate key for object with no property '${ppty}'`);
              }
              return obj[ppty];
            });
            return stem + key(args);
          };
        }(option.stem ? option.stem : '', option.property,
          keyFunc(option.sub)));
      } // else ignore option sub
    }

    return objectFunc(option.type, option);

  };

  return (function(keyFuncs, args) {
    const max = keyFuncs.length - 1;
    let rest = 0;
    let unordered = false;

    while (rest <= max) {
      if (args[rest].unordered) {
        if (rest === 0 && args.length === 1) {
          unordered = true;
          args[rest].rest = true;
        } else {
          throw new Error(
            `'unordered' option can only be used with a repeating single type`);
        }
      }
      if (args[rest].rest) {
        break;
      }
      rest++;
    }

    return function(...args) {

      const keys = args.map((arg, i) => {
        if (i <= max) {
          return keyFuncs[i](arg);
        } else {
          if (rest > max) {
            throw new Error(`Too many arguments, can't generate key`);
          }
          return keyFuncs[rest](arg);
        }
      });

      if (unordered) {
        keys.sort();
      }

      return keys.join('_');

    };

  })(args.map(func), args);

};
