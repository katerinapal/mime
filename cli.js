#!/usr/bin/env node
'use strict';

var _ = require('.');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

'use strict';

var mime = _2.default;
var file = process.argv[2];
var type = mime.getType(file);

process.stdout.write(type + '\n');
