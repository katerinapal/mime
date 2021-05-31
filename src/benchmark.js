"use strict";

var _lite = require("../lite");

var _lite2 = _interopRequireDefault(_lite);

var _ = require("..");

var _2 = _interopRequireDefault(_);

var _benchmark = require("benchmark");

var _benchmark2 = _interopRequireDefault(_benchmark);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Benchmark = _benchmark2.default;
var mime = _2.default;
var mimeLite = _lite2.default;

var suite = new Benchmark.Suite();

var extensions = Object.keys(mime._types);
var idx = 0;

suite.add('mime.getType', function () {
  mime.getType(extensions[idx++]);
  if (idx >= extensions.length) idx = 0;
}).add('mimeLite.getType', function () {
  mimeLite.getType(extensions[idx++]);
  if (idx >= extensions.length) idx = 0;
}).on('cycle', function (event) {
  console.log(String(event.target));
}).run();