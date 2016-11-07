import signature from 'sig';

function isValidSingleArg(arg) {
  return ((typeof arg === 'string') && (arg === 'strict' ||
    arg === 'loose')) || ((typeof arg === 'object') && (arg.idProperty ||
    arg.stem));
}

function strictKeyFunc(options = {}) {
  if (options.idProperty) {
    return (function(idProperty) {
      return function strictKey(inst) {
        if (!inst[idProperty]) {
          throw new ReferenceError(
            `No property '${idProperty}' defined for ${JSON.stringify(inst)}`);
        }
        return inst[idProperty];
      };
    })(options.idProperty);
  }

  return (function(stem) {
    var counter = 0;
    const map = new Map();
    return function strictKey(inst) {
      switch (typeof inst) {
        case 'number':
        case 'string': return stem + signature(inst);
      }
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

function looseKeyFunc() {
  return signature;
}

export default function keyFunc(...args) {

  const func = option => {
    if (option === 'strict') {
      return strictKeyFunc(option);
    } else if (option === 'loose') {
      return looseKeyFunc(option);
    } else if (option.idProperty || option.stem) {
      return strictKeyFunc(option);
    } else {
      return keyFunc(option);
    }
  };

  if (args.length === 1) {
    let arg = args[0];
    if (!isValidSingleArg(arg)) {
      throw new TypeError(`Unhandled option ${arg}`);
    }
    return func(arg);
  }

  return (function(keyFuncs) {
    return function(...args) {
      return args.map((arg, i) => {
        return keyFuncs[i](arg);
      }).join('_');
    };
  })(args.map(func));
};
