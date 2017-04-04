import sig from 'sig';
import objectFunc from './object-func';
import arrayFunc from './array-func';
import propertyFunc from './property-func';
import {formatHint} from './format-hint';

export class KeyFunc {
  _delegateToChildren (hints) {
    // Delegate to sub instances if more than one hint
    Object.defineProperty(this, 'keyFuncs', {
      value: hints.map(hint => new KeyFunc(hint)),
    });

    // Original hints are formatted through sub instances
    Object.defineProperty(this, 'hints', {
      value: this.keyFuncs.map(keyFunc => keyFunc.hint),
    });

    // Compute length
    Object.defineProperty(this, 'length', {
      value: this.keyFuncs.reduce((length, keyFunc) => {
        return length + keyFunc.length;
      }, 0),
    });

    // Make key function
    Object.defineProperty(this, 'keyfunc', {
      value: this._makeCombinedKeyfunc(this.keyFuncs),
    });
  }

  _makeCombinedKeyfunc (keyFuncs) {
    return (...args) => {
      if (this.length !== args.length) {
        throw new Error(`Inconsistent number of arguments, can't generate key`);
      }

      let n = 0;
      return sig(keyFuncs.map(keyFunc => {
        const slice = args.slice(n, n + keyFunc.length);
        n += keyFunc.length;
        return keyFunc.keyfunc(...slice);
      }).join(''));
    };
  }

  constructor (...hints) {
    if (hints.length > 1) {
      this._delegateToChildren(hints);
      return;
    }

    // Format hint
    const [hint] = hints;
    Object.defineProperty(this, 'hint', {
      value: formatHint(hint),
    });

    if (!this.hint.ntimes || this.hint.unordered) {
      // Set default length
      Object.defineProperty(this, 'length', {
        value: 1,
      });

      // Make key function
      Object.defineProperty(this, 'keyfunc', {
        value: this.makeSingleKeyfunc(this.hint),
      });
    } else {
      // Expand ntimes and delegate to children
      const hint = Object.assign({}, this.hint);
      delete hint.ntimes; // Protect against Max call stack size error

      const _hints = new Array(this.hint.ntimes);
      _hints.fill(hint);

      this._delegateToChildren(_hints);
    }
  }

  makeSingleKeyfunc ({type, subhint, repeat, unordered, ntimes}) {
    let kfnc;

    switch (type) {
    case 'literal':
      kfnc = sig;
      break;

    case 'object':
      kfnc = objectFunc();
      break;

    case 'array':
      kfnc = arrayFunc(keyfunc(subhint));
      break;

    case 'property':
      kfnc = propertyFunc(subhint);
      break;

    default:
      throw new TypeError(`Unhandled keyfunc type: ${JSON.stringify(type)}`);
    }

    return (...args) => {
      // By default, single key functions must take 1 argument
      // but they can be used repeatedly, thus the filtering below
      if (args.length === 0 || !repeat && args.length !== ntimes &&
        args.length !== 1) { // ntimes can be undefined, so check on 1 too
        throw new Error(`Inconsistent number of arguments, can't generate key`);
      }

      const keys = args.map(arg => kfnc(arg));

      if (keys.length === 1) {
        return keys[0];
      }

      return unordered ? sig(keys.sort().join('')) :
        sig(keys.join(''));
    };
  }
}

export default function keyfunc (...hints) {
  return new KeyFunc(...hints).keyfunc;
}
