#!/usr/bin/env node

import ext_fs_fs from "fs";
import ext_path_path from "path";
import ext_mimeScore from "mime-score";
import ext_db from "mime-db";
import ext_chalk_chalk from "chalk";

'use strict';

var STANDARD_FACET_SCORE = 900;

var byExtension = {};

// Clear out any conflict extensions in mime-db
for (var type in ext_db) {
  var entry = ext_db[type];
  entry.type = type;
  if (!entry.extensions) continue;

  entry.extensions.forEach(function(ext) {
    var drop;
    var keep = entry;
    if (ext in byExtension) {
      var e0 = entry;
      var e1 = byExtension[ext];

      e0.pri = ext_mimeScore(e0.type, e0.source);
      e1.pri = ext_mimeScore(e1.type, e1.source);

      drop = e0.pri < e1.pri ? e0 : e1;
      keep = e0.pri >= e1.pri ? e0 : e1;

      // Prefix lower-priority extensions with '*'
      drop.extensions = drop.extensions.map(function(e) {return e == ext ? '*' + e : e});

      console.log(
        ext + ': Preferring ' + ext_chalk_chalk.green(keep.type) + ' (' + keep.pri +
        ') over ' + ext_chalk_chalk.red(drop.type) + ' (' + drop.pri + ')' + ' for ' + ext
      );
    }

    // Cache the hightest ranking type for this extension
    if (keep == entry) byExtension[ext] = entry;
  });
}

function writeTypesFile(types, path) {
  ext_fs_fs.writeFileSync(path, 'module.exports = ' + JSON.stringify(types) + ';');
}

// Segregate into standard and non-standard types based on facet per
// https://tools.ietf.org/html/rfc6838#section-3.1
var standard = {};
var other = {};

Object.keys(ext_db).sort().forEach(function(k) {
  var entry = ext_db[k];

  if (entry.extensions) {
    if (ext_mimeScore(entry.type, entry.source) >= STANDARD_FACET_SCORE) {
      standard[entry.type] = entry.extensions;
    } else {
      other[entry.type] = entry.extensions;
    }
  }
});

writeTypesFile(standard, ext_path_path.join(__dirname, '../types', 'standard.js'));
writeTypesFile(other, ext_path_path.join(__dirname, '../types', 'other.js'));
