'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = strictFunc;

var _isString = require('is-string');

var _isString2 = _interopRequireDefault(_isString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function strictFunc(_stem) {
  var stem = (0, _isString2.default)(_stem) ? _stem : '';

  return function (stem) {
    var counter = 0;
    var map = new WeakMap();

    return function (obj) {
      var key = map.get(obj);

      if (!key) {
        counter++;
        key = stem + counter;
        try {
          map.set(obj, key);
        } catch (e) {
          counter--;
          throw new TypeError('Function can only generate keys for objects,\nbut argument was: ' + JSON.stringify(obj));
        }
      }

      return key;
    };
  }(stem);
};
module.exports = exports['default'];