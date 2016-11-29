'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = strictFunc;

var _isString = require('is-string');

var _isString2 = _interopRequireDefault(_isString);

var _sig = require('sig');

var _sig2 = _interopRequireDefault(_sig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function strictFunc(stem) {

  if (!(0, _isString2.default)(stem)) {
    stem = '';
  }

  return function (stem) {
    return function (obj) {
      return stem + (0, _sig2.default)(obj);
    };
  }(stem);
};
module.exports = exports['default'];