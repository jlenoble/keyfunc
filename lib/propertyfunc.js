'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = propertyFunc;

var _isString = require('is-string');

var _isString2 = _interopRequireDefault(_isString);

var _sig = require('sig');

var _sig2 = _interopRequireDefault(_sig);

var _loosefunc = require('./loosefunc');

var _loosefunc2 = _interopRequireDefault(_loosefunc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function propertyFunc(property) {
  var stem = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var propertyKeyFunc = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : (0, _loosefunc2.default)();


  if (!(0, _isString2.default)(property)) {
    throw new TypeError('propertyFunc requires a string as first argument,\nbut it was: ' + JSON.stringify(property));
  }

  if (!(0, _isString2.default)(stem)) {
    stem = '';
  }

  return function (property, stem, keyFunc) {
    return function (args) {
      args = [args].concat(_toConsumableArray(property.split(':'))).reduce(function (obj, ppty) {
        if (obj[ppty] === undefined) {
          throw new ReferenceError('Can\'t generate key for object with no property \'' + ppty + '\'');
        }
        return obj[ppty];
      });

      return stem + keyFunc(args);
    };
  }(property, stem, propertyKeyFunc);
};
module.exports = exports['default'];