import signature from 'sig';

function strictKeyFunc(options = {}) {
  if (options.idProperty) {
    return (function(idProperty) {
      return function strictKey(inst) {
        return inst[idProperty];
      };
    })(options.idProperty);
  }

  return (function(stem) {
    var counter = 0;
    const map = new Map();
    return function strictKey(inst) {
      var key = map.get(inst);
      if (!key) {
        counter++;
        key = stem + counter;
        map.set(inst, key);
      }
      return key;
    };
  })(options.stem ? options.stem : 'key');
}

function looseKeyFunc(options = {}) {
  if (options.idProperty) {
    return (function(idProperty) {
      return function strictKey(inst) {
        return inst[idProperty];
      };
    })(options.idProperty);
  }

  return signature;
}

export default function keyFunc(...args) {

  const func = option => {
    if (option === 'strict' || option.strict) {
      return strictKeyFunc(option);
    } else if (option === 'loose' || option.loose) {
      return looseKeyFunc(option);
    } else {
      return keyFunc(option);
    }
  };

  if (args.length === 1) {
    return func(args[0]);
  }

  return (function(keyFuncs) {
    return function(...args) {
      return args.map((arg, i) => {
        return keyFuncs[i](arg);
      }).join('_');
    };
  })(args.map(func));
};
