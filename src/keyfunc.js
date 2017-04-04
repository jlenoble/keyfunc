import sig from 'sig';
import objectFunc from './object-func';
import arrayFunc from './array-func';
import propertyFunc from './property-func';

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

  _hasOptionNTimes () {
    let {ntimes} = this.hint;

    if (ntimes === undefined) {
      return false;
    }

    if (typeof ntimes !== 'number') {
      throw new TypeError(`Not a number: ${JSON.stringify(ntimes)}`);
    }

    ntimes = parseInt(ntimes, 10);

    if (ntimes === 1) {
      return false; // Useless option
    }

    if (ntimes === 0) {
      throw new Error('ntimes is 0, not handled yet');
    }

    const hint = Object.assign({}, this.hint);
    delete hint.ntimes;

    const hints = new Array(ntimes);
    hints.fill(hint);

    this._delegateToChildren(hints);
    return true;
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
      value: this.formatHint(hint),
    });

    if (!this._hasOptionNTimes()) {
      // Set default length
      Object.defineProperty(this, 'length', {
        value: 1,
      });

      // Make key function
      Object.defineProperty(this, 'keyfunc', {
        value: this.makeSingleKeyfunc(this.hint),
      });
    }
  }

  formatHint (hint) {
    let _hint;

    switch (typeof hint) {
    case 'undefined':
      _hint = {type: 'object'};
      break;

    case 'string':
      if (!hint.includes(':')) {
        _hint = {type: hint};
      } else {
        const [type, ...hints] = hint.split(':');
        _hint = {
          type, subhint: hints.join(':'),
        };
      }
      break;

    case 'object':
      if (hint.type) {
        _hint = hint;
        break;
      }
    // FALL THROUGH !

    default:
      throw new TypeError(`Unhandled keyfunc hint: ${JSON.stringify(hint)}`);
    }

    if (_hint.unordered) {
      // By default, if args are unordered, then their number is unbound
      _hint.repeat = true;
    }

    return _hint;
  }

  makeSingleKeyfunc ({type, subhint, repeat, unordered}) {
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
      if (args.length === 0 || args.length !== 1 && !repeat) {
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
