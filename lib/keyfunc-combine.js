'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = combineFunc;

var _sig = require('sig');

var _sig2 = _interopRequireDefault(_sig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var checkArgsLength = function checkArgsLength(args, _ref) {
  var length = _ref.length,
      trailingIgnores = _ref.trailingIgnores,
      unbound = _ref.unbound,
      optional = _ref.optional;

  if (!unbound) {
    if (length === args.length) {
      return;
    }

    if (length - trailingIgnores <= args.length && args.length < length) {
      return;
    }
  } else {
    if (args.length >= length) {
      return;
    }

    if (optional && args.length === length - 1) {
      // Relies on pseudo length 1 for last hint (it can't be known in advance)
      // So minimum authorized length for args is the instance length minus
      // that pseudo length
      return;
    }
  }

  throw new Error('Inconsistent number of arguments, can\'t generate key');
};

function combineFunc(_ref2) {
  var keyFuncs = _ref2.keyFuncs,
      length = _ref2.length,
      trailingIgnores = _ref2.trailingIgnores,
      unbound = _ref2.unbound,
      optional = _ref2.optional;

  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    checkArgsLength(args, { length: length, trailingIgnores: trailingIgnores, unbound: unbound, optional: optional });

    var n = 0;
    return (0, _sig2.default)(keyFuncs.map(function (keyFunc, i) {
      var slice = void 0;
      if (unbound && i === keyFuncs.length - 1) {
        slice = args.slice(n);
      } else {
        slice = args.slice(n, n + keyFunc.length);
      }
      n += keyFunc.length;
      return keyFunc.keyfunc.apply(keyFunc, _toConsumableArray(slice));
    }).join(''));
  };
}
module.exports = exports['default'];