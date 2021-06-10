#!/usr/bin/env node
'use strict';

var _ = require('.');

'use strict';

var file = process.argv[2];
var type = _.indexjs.getType(file);

process.stdout.write(type + '\n');
