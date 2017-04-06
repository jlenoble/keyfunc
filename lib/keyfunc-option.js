'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = optionFunc;

var _sig = require('sig');

var _sig2 = _interopRequireDefault(_sig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function optionFunc(sub, keyfunc) {
  if ((typeof sub === 'undefined' ? 'undefined' : _typeof(sub)) !== 'object') {
    throw new TypeError('optionFunc requires an object as first argument,\nbut it was: ' + JSON.stringify(sub));
  }

  var keyObject = {};

  Object.keys(sub).forEach(function (key) {
    keyObject[key] = keyfunc(sub[key]);
  });

  return function (opt) {
    var keys = {};
    Object.keys(keyObject).forEach(function (key) {
      keys[key] = keyObject[key](opt[key]);
    });
    return (0, _sig2.default)(keys);
  };
};
module.exports = exports['default'];