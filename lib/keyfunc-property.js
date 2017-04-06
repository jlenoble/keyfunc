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

function propertyFunc(property) {
  var propertyKeyfunc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _sig2.default;

  if (!(0, _isString2.default)(property)) {
    throw new TypeError('propertyFunc requires a string as first argument,\nbut it was: ' + JSON.stringify(property));
  }

  return function (arg) {
    var _arg = property.split(':').reduce(function (obj, ppty) {
      if (obj[ppty] === undefined) {
        throw new ReferenceError('Can\'t generate key for object with no property \'' + ppty + '\'');
      }
      return obj[ppty];
    }, arg);

    return propertyKeyfunc(_arg);
  };
};
module.exports = exports['default'];