'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = objectFunc;

var _isString = require('is-string');

var _isString2 = _interopRequireDefault(_isString);

var _strictfunc = require('./strictfunc');

var _strictfunc2 = _interopRequireDefault(_strictfunc);

var _loosefunc = require('./loosefunc');

var _loosefunc2 = _interopRequireDefault(_loosefunc);

var _propertyfunc = require('./propertyfunc');

var _propertyfunc2 = _interopRequireDefault(_propertyfunc);

var _arrayfunc = require('./arrayfunc');

var _arrayfunc2 = _interopRequireDefault(_arrayfunc);

var _setfunc = require('./setfunc');

var _setfunc2 = _interopRequireDefault(_setfunc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function objectFunc(type, stem) {

  if (!(0, _isString2.default)(type)) {
    type = 'object';
  }

  if (!stem) {
    stem = {};
  }

  switch (type) {

    case 'object':
      return (0, _strictfunc2.default)(stem.stem || stem);
      break;

    case 'literal':
      return (0, _loosefunc2.default)(stem.stem || stem);
      break;

    case 'property':
      return (0, _propertyfunc2.default)(stem.property || stem, stem.stem);
      break;

    case 'array':
      return (0, _arrayfunc2.default)(stem.stem || stem);
      break;

    case 'set':
      return (0, _setfunc2.default)(stem.stem || stem);
      break;

    default:
      throw new TypeError('Keys can\'t be created for type ' + type);

  }
};
module.exports = exports['default'];