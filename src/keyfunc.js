import sig from 'sig';
import objectFunc from './object-func';

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

    // Make key function
    Object.defineProperty(this, 'keyfunc', {
      value: this.makeCombinedKeyfunc(this.keyFuncs),
    });
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

    // Make key function
    Object.defineProperty(this, 'keyfunc', {
      value: this.makeSingleKeyfunc(this.hint),
    });
  }

  formatHint (hint) {
    switch (typeof hint) {
    case 'string':
      return {type: hint};

    case 'object':
      if (hint.type) {
        return hint;
      }

    case 'undefined':
      return {type: 'object'};

    default:
      throw new TypeError(`Unhandled keyfunc hint: ${JSON.stringify(hint)}`);
    }
  }

  makeSingleKeyfunc ({type}) {
    switch (type) {
    case 'literal':
      return arg => sig(arg);

    case 'object':
      return objectFunc();

    default:
      throw new TypeError(`Unhandled keyfunc type: ${type}`);
    }
  }

  makeCombinedKeyfunc (keyFuncs) {
    const keyfuncs = keyFuncs
      .map(keyFunc => keyFunc.keyfunc);

    return (...args) => {
      if (keyfuncs.length !== args.length) {
        throw new Error(`Inconsistent number of arguments, can't generate key`);
      }

      return sig(keyfuncs.map((keyfunc, i) => keyfunc(args[i])).join(''));
    };
  }
}

export default function keyfunc (...hints) {
  return new KeyFunc(...hints).keyfunc;
}
