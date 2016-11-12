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

function arrayFunc(stem) {

  if (!(0, _isString2.default)(stem)) {
    stem = '';
  }

  return function (_stem, _strictFunc) {

    return function (arr) {
      return _stem + (0, _sig2.default)(arr.map(_strictFunc));
    };
  }(stem, (0, _strictfunc2.default)(stem));
};
module.exports = exports['default'];