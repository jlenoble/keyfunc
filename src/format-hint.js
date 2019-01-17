import isString from 'is-string';

export const formatOptionNTimes = ({ntimes}) => {
  if (ntimes === undefined) {
    return;
  }

  if (typeof ntimes !== 'number') {
    throw new TypeError(`Not a number: ${JSON.stringify(ntimes)}`);
  }

  const _ntimes = parseInt(ntimes, 10);

  if (ntimes === 1) {
    return; // Useless option
  }

  if (ntimes === 0) {
    throw new Error('Option ntimes set, but is 0, not handled yet');
  }

  return _ntimes;
};

export const formatOptionSub = (sub, typesuffix, wrap = true) => {
  if (Array.isArray(sub)) {
    return {
      elementHints: sub,
      arrayHint: {spread: true},
    };
  }

  if (isString(sub)) {
    if (typesuffix !== undefined && sub != typesuffix) {
      throw new Error(`Incompatible options: sub:${
        sub} and typesuffix:${typesuffix}`);
    }

    return {type: sub};
  }

  if (typeof sub === 'object') {
    if (typesuffix !== undefined && sub.type !== undefined &&
      sub.type != typesuffix) {
      throw new Error(`Incompatible options: sub:${
        sub} and typesuffix:${typesuffix}`);
    }

    const arrayHint = {};
    if (sub.unordered !== undefined) {
      arrayHint.unordered = sub.unordered;
    }
    if (sub.unique !== undefined) {
      arrayHint.unique = sub.unique;
    }
    if (sub.ntimes !== undefined) {
      arrayHint.ntimes = sub.ntimes;
    }

    let elementHints = Object.assign({
      type: typesuffix || (sub.property ? 'property' : 'object'),
    }, sub);

    delete elementHints.unordered;
    delete elementHints.unique;
    delete elementHints.ntimes;

    if (wrap) {
      elementHints = [elementHints];
    }

    return {elementHints, arrayHint};
  }

  throw new TypeError(`Unhandled option sub ${JSON.stringify(sub)}`);
};

export const splitHint = _hint => {
  const [hint, ...hints] = _hint.split(':');
  return {
    type: hint, typesuffix: hints.join(':'),
  };
};

export const formatHint = hint => {
  let _hint;

  switch (typeof hint) {
  case 'undefined':
    _hint = {type: 'object'};
    break;

  case 'string':
    _hint = splitHint(hint);
    if (_hint.typesuffix === '') {
      delete _hint.typesuffix;
    }
    break;

  case 'object':
    if (hint.type) {
      _hint = splitHint(hint.type);
      _hint = Object.assign({}, hint, _hint);
      if (_hint.typesuffix === '') {
        delete _hint.typesuffix;
      }
      break;
    }
    if (hint.property) { // Shortcut {property: 'id'}
      _hint = Object.assign({type: 'property'}, hint);
      break;
    }
    if (hint.preprocess) { // Shortcut {preprocess: (...args) => {...}}
      _hint = Object.assign({type: 'literal'}, hint);
      break;
    }
    // else FALL THROUGH !

  default:
    throw new TypeError(`Unhandled keyfunc hint: ${JSON.stringify(hint)}`);
  }

  _hint.ntimes = formatOptionNTimes(_hint);

  if (_hint.unordered || _hint.unique) {
    _hint.repeat = true;
  }

  return _hint;
};
