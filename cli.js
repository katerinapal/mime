#!/usr/bin/env node

import { indexjs as mime } from ".";

'use strict';

var file = process.argv[2];
var type = mime.getType(file);

process.stdout.write(type + '\n');

