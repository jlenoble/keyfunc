import sig from 'sig';
import objectFunc from './object-func';
import arrayFunc from './keyfunc-array';
import propertyFunc from './property-func';
import removeDuplicates from './remove-duplicates';

export default function singleFunc ({
  type, property, typesuffix,
  repeat, unordered, ntimes, unique,
}, keyfunc) { // Recursive generation
  let kfnc;

  switch (type) {
  case 'literal':
    kfnc = sig;
    break;

  case 'object':
    kfnc = objectFunc();
    break;

  case 'array':
    kfnc = arrayFunc(keyfunc(typesuffix));
    break;

  case 'property':
    if (property) {
      // Option form: {type: 'property[:typesuffix]', property: 'propname'}
      kfnc = typesuffix ? propertyFunc(property, keyfunc(typesuffix)) :
        propertyFunc(property);
    } else {
      // Shortcut form: 'property:propname', assuming default type 'literal'
      kfnc = keyfunc({
        type: 'property',
        property: typesuffix,
      });
    }
    break;

  case 'ignore':
  // Rely on kfnc remains undefined
    break;

  default:
    throw new TypeError(`Unhandled keyfunc type: ${JSON.stringify(type)}`);
  }

  return (...args) => {
    if (!kfnc) { // Ok, type 'ignore'
      return;
    }

    // By default, single key functions must take 1 argument
    // but they can be used repeatedly, thus the filtering below
    if (args.length === 0 || !repeat && args.length !== ntimes &&
      args.length !== 1) { // ntimes can be undefined, so check on 1 too
      throw new Error(`Inconsistent number of arguments, can't generate key`);
    }

    let keys = args.map(arg => kfnc(arg));

    if (unique) {
      keys = removeDuplicates(...keys);
    }

    if (keys.length === 1) {
      return keys[0];
    }

    return unordered ? sig(keys.sort().join('')) :
      sig(keys.join(''));
  };
};
