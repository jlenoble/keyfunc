import isString from 'is-string';
import objectFunc from './objectfunc';
import propertyFunc from './propertyfunc';
import signature from 'sig';

export default function keyFunc(...args) {

  const func = option => {

    if (isString(option)) {
      option = {
        type: option
      };
    }

    if (option.optional) {
      delete option.optional;
      return (function(stem, key) {
        return function(...args) {
          if (args.length === 0 || (args.length === 1 &&
            args[0] === undefined)) {
            return stem + '0';
          } else {
            return key(...args);
          }
        };
      }(option.stem ? option.stem : '', keyFunc(option)));
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
        return propertyFunc(option.property, option.stem ? option.stem : '',
          keyFunc(option.sub));
      } else if (option.type === 'option') {
        let keyObject = {};
        for (let key in option.sub) {
          keyObject[key] = keyFunc(option.sub[key]);
        }
        return (function(stem, keyObject) {
          return function(args) {
            let res = {};
            for (let key in keyObject) {
              res[key] = keyObject[key](args[key]);
            }
            return stem + signature(res);
          };
        }(option.stem ? option.stem : '', keyObject));
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

      let keys = [];
      args.forEach((arg, i) => {
        if (i <= max) {
          if (keyFuncs[i]) {
            keys.push(keyFuncs[i](arg));
          }
        } else {
          if (rest > max) {
            throw new Error(`Too many arguments, can't generate key`);
          }
          if (keyFuncs[rest]) {
            keys.push(keyFuncs[rest](arg));
          }
        }
      });

      if (unordered) {
        keys.sort();
      }

      return keys.join('_');

    };

  })(args.map(func), args);

};
