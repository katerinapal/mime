"use strict";

var _benchmark = require("benchmark");

var _benchmark2 = _interopRequireDefault(_benchmark);

var _ = require("..");

var _lite = require("../lite");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var suite = new _benchmark2.default.Suite();

var extensions = Object.keys(_.indexjs._types);
var idx = 0;

suite.add('mime.getType', function () {
  _.indexjs.getType(extensions[idx++]);
  if (idx >= extensions.length) idx = 0;
}).add('mimeLite.getType', function () {
  _lite.litejs.getType(extensions[idx++]);
  if (idx >= extensions.length) idx = 0;
}).on('cycle', function (event) {
  console.log(String(event.target));
}).run();