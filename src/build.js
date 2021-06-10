#!/usr/bin/env node
"use strict";

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _mimeScore = require("mime-score");

var _mimeScore2 = _interopRequireDefault(_mimeScore);

var _mimeDb = require("mime-db");

var _mimeDb2 = _interopRequireDefault(_mimeDb);

var _chalk = require("chalk");

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

'use strict';

var STANDARD_FACET_SCORE = 900;

var byExtension = {};

// Clear out any conflict extensions in mime-db
for (var type in _mimeDb2.default) {
  var entry = _mimeDb2.default[type];
  entry.type = type;
  if (!entry.extensions) continue;

  entry.extensions.forEach(function (ext) {
    var drop;
    var keep = entry;
    if (ext in byExtension) {
      var e0 = entry;
      var e1 = byExtension[ext];

      e0.pri = (0, _mimeScore2.default)(e0.type, e0.source);
      e1.pri = (0, _mimeScore2.default)(e1.type, e1.source);

      drop = e0.pri < e1.pri ? e0 : e1;
      keep = e0.pri >= e1.pri ? e0 : e1;

      // Prefix lower-priority extensions with '*'
      drop.extensions = drop.extensions.map(function (e) {
        return e == ext ? '*' + e : e;
      });

      console.log(ext + ': Preferring ' + _chalk2.default.green(keep.type) + ' (' + keep.pri + ') over ' + _chalk2.default.red(drop.type) + ' (' + drop.pri + ')' + ' for ' + ext);
    }

    // Cache the hightest ranking type for this extension
    if (keep == entry) byExtension[ext] = entry;
  });
}

function writeTypesFile(types, path) {
  _fs2.default.writeFileSync(path, 'module.exports = ' + JSON.stringify(types) + ';');
}

// Segregate into standard and non-standard types based on facet per
// https://tools.ietf.org/html/rfc6838#section-3.1
var standard = {};
var other = {};

Object.keys(_mimeDb2.default).sort().forEach(function (k) {
  var entry = _mimeDb2.default[k];

  if (entry.extensions) {
    if ((0, _mimeScore2.default)(entry.type, entry.source) >= STANDARD_FACET_SCORE) {
      standard[entry.type] = entry.extensions;
    } else {
      other[entry.type] = entry.extensions;
    }
  }
});

writeTypesFile(standard, _path2.default.join(__dirname, '../types', 'standard.js'));
writeTypesFile(other, _path2.default.join(__dirname, '../types', 'other.js'));