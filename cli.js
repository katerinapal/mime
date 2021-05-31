#!/usr/bin/env node

import mod_indexjs from ".";

'use strict';

var mime = mod_indexjs;
var file = process.argv[2];
var type = mime.getType(file);

process.stdout.write(type + '\n');

