import sig from 'sig';
import objectFunc from './keyfunc-object';
import arrayFunc from './keyfunc-array';
import propertyFunc from './keyfunc-property';
import optionFunc from './keyfunc-option';
import optionalFunc from './keyfunc-optional';
import removeDuplicates from './remove-duplicates';
import {formatOptionSub} from './format-hint';

const checkArgsLength = (args, {repeat, ntimes}) => {
  // By default, single key functions must take 1 argument
  // but they can be used repeatedly, thus the filtering below

  if (args.length !== 0) {
    if (args.length === 1 || args.length === ntimes) {
      return;
    }

    if (repeat && ntimes === undefined) {
      return;
    }
  }

  throw new Error(`Inconsistent number of arguments, can't generate key`);
};

export default function singleFunc ({
  type, property, typesuffix, sub, preprocess,
  optional, repeat, unordered, ntimes, unique,
}, keyfunc) { // Recursive generation
  let kfnc;

  if (optional && type !== 'ignore') {
    return optionalFunc(singleFunc({type, property, typesuffix, sub}, keyfunc),
      {ntimes, repeat, unordered, unique});
  }

  switch (type) {
  case 'literal':
    kfnc = sig;
    break;

  case 'object':
    kfnc = objectFunc();
    break;

  case 'array':
    if (sub) {
      const hint = formatOptionSub(sub, typesuffix);
      kfnc = arrayFunc(keyfunc(...hint.elementHints), hint.arrayHint);
    } else {
      // Shortcut used: 'array[:typesuffix]'
      kfnc = arrayFunc(keyfunc(typesuffix));
    }
    break;

  case 'set':
    if (sub) {
      const hint = formatOptionSub(sub, typesuffix);
      kfnc = arrayFunc(keyfunc(...hint.elementHints), Object.assign({
        unordered: true, unique: true}, hint.arrayHint));
    } else {
      // Shortcut used: 'set[:typesuffix]'
      kfnc = arrayFunc(keyfunc(typesuffix), {unordered: true, unique: true});
    }
    break;

  case 'property':
    if (property) {
      if (sub) {
        const hint = formatOptionSub(sub, typesuffix, false);
        kfnc = propertyFunc(property, keyfunc(hint.elementHints));
      } else {
        // Option form: {type: 'property[:typesuffix]', property: 'propname'}
        kfnc = typesuffix ? propertyFunc(property, keyfunc(typesuffix)) :
          propertyFunc(property);
      }
    } else {
      // Shortcut form: 'property:propname', assuming default type 'literal'
      kfnc = keyfunc({
        type: 'property',
        property: typesuffix,
      });
    }
    break;

  case 'option':
    kfnc = optionFunc(sub, keyfunc);
    break;

  case 'ignore':
  // Rely on kfnc remains undefined
    break;

  default:
    throw new TypeError(`Unhandled keyfunc type: ${JSON.stringify(type)}`);
  }

  return (..._args) => {
    if (!kfnc) { // Ok, type 'ignore'
      return;
    }

    const args = preprocess ? [preprocess(..._args)] : _args;

    checkArgsLength(args, {repeat, ntimes});

    let keys = args.map(arg => kfnc(arg));

    if (unique) {
      keys = removeDuplicates(...keys);
    }

    if (keys.length === 1) {
      return keys[0];
    }

    if (unordered) {
      keys = keys.sort();
    }

    return sig(keys.join(''));
  };
};
