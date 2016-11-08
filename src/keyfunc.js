import signature from 'sig';

function strictKeyFunc(options = {}) {
  options = Object.assign({stem: 'key'}, options);
  var key;

  if (options.type) {
    let type = options.type;
    if (type === String) {
      type = 'string';
    } else if (type === Number) {
      type = 'number';
    } else if (type === Object) {
      type = 'object';
    } else if (type === Array) {
      type = 'array';
    }

    if (type === 'string' || type === 'number') {
      key = (function(stem, type) {
        return inst => {
          if (typeof inst !== type) {
            throw new TypeError(
              `Expected type ${type} or Number for ${JSON.stringify(inst)}`);
          }
          return stem + inst;
        };
      })(options.stem, type);
    } else {
      key = (function(stem, type) {
        var counter = 0;
        const map = new WeakMap();
        return inst => {
          let isArray = Array.isArray(inst);
          let thrw = ((type !== 'object' || isArray) &&
            !(type === 'array' && isArray));
          if (thrw) {
            throw new TypeError(
              `Expected type ${type} for ${JSON.stringify(inst)}`);
          }
          var key = map.get(inst);
          if (!key) {
            counter++;
            key = stem + counter;
            map.set(inst, key);
          }
          return key;
        };
      })(options.stem, type);
    }
  } else {
    key = (function(stem) {
      var counter = 0;
      const map = new WeakMap();
      return inst => {
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
    })(options.stem);
  }

  if (options.idProperty) {
    return (function(idProperty, key) {
      return inst => {
        if (!inst[idProperty]) {
          throw new ReferenceError(
            `No property '${idProperty}' defined for ${JSON.stringify(inst)}`);
        }
        return key(inst[idProperty]);
      };
    })(options.idProperty, key);
  }

  return key;
}

function looseKeyFunc(options = {}) {
  options = Object.assign({stem: 'key'}, options);

  const key = (function(stem) {
    return inst => stem + signature(inst);
  })(options.stem);

  if (options.idProperty) {
    return (function(idProperty, key) {
      return inst => {
        if (!inst[idProperty]) {
          throw new ReferenceError(
            `No property '${idProperty}' defined for ${JSON.stringify(inst)}`);
        }
        return key(inst[idProperty]);
      };
    })(options.idProperty, key);
  }

  return key;
}

export default function keyFunc(...args) {

  const func = option => {
    if (option === 'strict') {
      return strictKeyFunc(option);
    } else if (option === 'loose') {
      return looseKeyFunc(option);
    } else if (option.idProperty || option.stem) {
      return option.loose ? looseKeyFunc(option) : strictKeyFunc(option);
    }
  };

  return (function(keyFuncs) {
    return function(...args) {
      return args.map((arg, i) => {
        return keyFuncs[i](arg);
      }).join('_');
    };
  })(args.map(func));
};
