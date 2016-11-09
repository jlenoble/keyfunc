'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = propertyFunc;

var _isString = require('is-string');

var _isString2 = _interopRequireDefault(_isString);

var _sig = require('sig');

var _sig2 = _interopRequireDefault(_sig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function propertyFunc(property, stem) {

  if (!(0, _isString2.default)(property)) {
    throw new TypeError('propertyFunc requires a string as first argument,\nbut it was: ' + JSON.stringify(property));
  }

  if (!(0, _isString2.default)(stem)) {
    stem = '';
  }

  return function (property, stem) {
    return function (obj) {
      if (obj[property] === undefined) {
        throw new ReferenceError('Can\'t generate key for object with no property \'' + property + '\'');
      }
      return stem + (0, _sig2.default)(obj[property]);
    };
  }(property, stem);
};
module.exports = exports['default'];