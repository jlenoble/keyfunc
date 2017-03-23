'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = arrayFunc;

var _isString = require('is-string');

var _isString2 = _interopRequireDefault(_isString);

var _sig = require('sig');

var _sig2 = _interopRequireDefault(_sig);

var _strictfunc = require('./strictfunc');

var _strictfunc2 = _interopRequireDefault(_strictfunc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function arrayFunc(_stem) {
  var elementKeyFunc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : (0, _strictfunc2.default)();

  var stem = (0, _isString2.default)(_stem) ? _stem : '';

  return function (_stem, keyFunc) {
    return function (arr) {
      return _stem + (0, _sig2.default)(arr.map(function (arg) {
        return keyFunc(arg);
        // used to be arr => _stem + signature(arr.map(keyFunc))
        // but it breaks when keyFunc is defined with a rest operator
        // because then the args passed to keyFunc are (arg, i, arr)
        // and keyFunc may treat those as arg0, arg1, arg2 in some loop
      }));
    };
  }(stem, elementKeyFunc);
};
module.exports = exports['default'];