'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatHint = exports.splitHint = exports.formatOptionSub = exports.formatOptionNTimes = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _isString = require('is-string');

var _isString2 = _interopRequireDefault(_isString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

var formatOptionNTimes = exports.formatOptionNTimes = function formatOptionNTimes(_ref) {
  var ntimes = _ref.ntimes;

  if (ntimes === undefined) {
    return;
  }

  if (typeof ntimes !== 'number') {
    throw new TypeError('Not a number: ' + JSON.stringify(ntimes));
  }

  var _ntimes = parseInt(ntimes, 10);

  if (ntimes === 1) {
    return; // Useless option
  }

  if (ntimes === 0) {
    throw new Error('Option ntimes set, but is 0, not handled yet');
  }

  return _ntimes;
};

var formatOptionSub = exports.formatOptionSub = function formatOptionSub(sub, typesuffix) {
  var wrap = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  if (Array.isArray(sub)) {
    return {
      elementHints: sub,
      arrayHint: { spread: true }
    };
  }

  if ((0, _isString2.default)(sub)) {
    if (typesuffix !== undefined && sub != typesuffix) {
      throw new Error('Incompatible options: sub:' + sub + ' and typesuffix:' + typesuffix);
    }

    return { type: sub };
  }

  if ((typeof sub === 'undefined' ? 'undefined' : _typeof(sub)) === 'object') {
    if (typesuffix !== undefined && sub.type !== undefined && sub.type != typesuffix) {
      throw new Error('Incompatible options: sub:' + sub + ' and typesuffix:' + typesuffix);
    }

    var unordered = sub.unordered,
        unique = sub.unique,
        ntimes = sub.ntimes;

    var arrayHint = { unordered: unordered, unique: unique, ntimes: ntimes };

    var elementHints = Object.assign({
      type: typesuffix || (sub.property ? 'property' : 'object')
    }, sub);

    delete elementHints.unordered;
    delete elementHints.unique;
    delete elementHints.ntimes;

    if (wrap) {
      elementHints = [elementHints];
    }

    return { elementHints: elementHints, arrayHint: arrayHint };
  }

  throw new TypeError('Unhandled option sub ' + JSON.stringify(sub));
};

var splitHint = exports.splitHint = function splitHint(_hint) {
  var _hint$split = _hint.split(':'),
      _hint$split2 = _toArray(_hint$split),
      hint = _hint$split2[0],
      hints = _hint$split2.slice(1);

  return {
    type: hint, typesuffix: hints.join(':')
  };
};

var formatHint = exports.formatHint = function formatHint(hint) {
  var _hint = void 0;

  switch (typeof hint === 'undefined' ? 'undefined' : _typeof(hint)) {
    case 'undefined':
      _hint = { type: 'object' };
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
      if (hint.property) {
        // Shortcut {property: 'id'}
        _hint = Object.assign({ type: 'property' }, hint);
        break;
      }
      if (hint.preprocess) {
        // Shortcut {preprocess: (...args) => {...}}
        _hint = Object.assign({ type: 'literal' }, hint);
        break;
      }
    // else FALL THROUGH !

    default:
      throw new TypeError('Unhandled keyfunc hint: ' + JSON.stringify(hint));
  }

  _hint.ntimes = formatOptionNTimes(_hint);

  if (_hint.unordered || _hint.unique) {
    _hint.repeat = true;
  }

  return _hint;
};