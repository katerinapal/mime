"use strict";

var _ = require("..");

var _assert = require("assert");

var _assert2 = _interopRequireDefault(_assert);

var _chalk = require("chalk");

var _chalk2 = _interopRequireDefault(_chalk);

var _Mime = require("../Mime");

require("../lite");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

'use strict';

var mimeTypes = require('../node_modules/mime-types');

describe('class Mime', function () {
  it('mime and mime/lite coexist', function () {
    _assert2.default.doesNotThrow(function () {});
  });

  it('new constructor()', function () {
    var mime = new _Mime.Mime({ 'text/a': ['a', 'a1'] }, { 'text/b': ['b', 'b1'] });

    _assert2.default.deepEqual(mime._types, {
      a: 'text/a',
      a1: 'text/a',
      b: 'text/b',
      b1: 'text/b'
    });

    _assert2.default.deepEqual(mime._extensions, {
      'text/a': 'a',
      'text/b': 'b'
    });
  });

  it('define()', function () {
    var mime = new _Mime.Mime({ 'text/a': ['a'] }, { 'text/b': ['b'] });

    _assert2.default.throws(function () {
      mime.define({ 'text/c': ['b'] });
    });

    _assert2.default.doesNotThrow(function () {
      mime.define({ 'text/c': ['b'] }, true);
    });

    _assert2.default.deepEqual(mime._types, {
      a: 'text/a',
      b: 'text/c'
    });

    _assert2.default.deepEqual(mime._extensions, {
      'text/a': 'a',
      'text/b': 'b',
      'text/c': 'b'
    });
  });

  it('define() *\'ed types', function () {
    var mime = new _Mime.Mime({ 'text/a': ['*b'] }, { 'text/b': ['b'] });

    _assert2.default.deepEqual(mime._types, {
      b: 'text/b'
    });

    _assert2.default.deepEqual(mime._extensions, {
      'text/a': 'b',
      'text/b': 'b'
    });
  });

  it('case-insensitive', function () {
    var mime = new _Mime.Mime({
      'TEXT/UPPER': ['UP'],
      'text/lower': ['low']
    });

    _assert2.default.equal(mime.getType('test.up'), 'text/upper');
    _assert2.default.equal(mime.getType('test.UP'), 'text/upper');
    _assert2.default.equal(mime.getType('test.low'), 'text/lower');
    _assert2.default.equal(mime.getType('test.LOW'), 'text/lower');

    _assert2.default.equal(mime.getExtension('text/upper'), 'up');
    _assert2.default.equal(mime.getExtension('text/lower'), 'low');
    _assert2.default.equal(mime.getExtension('TEXT/UPPER'), 'up');
    _assert2.default.equal(mime.getExtension('TEXT/LOWER'), 'low');
  });

  it('getType()', function () {
    // Upper/lower case
    _assert2.default.equal(_.indexjs.getType('text.txt'), 'text/plain');
    _assert2.default.equal(_.indexjs.getType('TEXT.TXT'), 'text/plain');

    // Bare extension
    _assert2.default.equal(_.indexjs.getType('txt'), 'text/plain');
    _assert2.default.equal(_.indexjs.getType('.txt'), 'text/plain');
    _assert2.default.strictEqual(_.indexjs.getType('.bogus'), null);
    _assert2.default.strictEqual(_.indexjs.getType('bogus'), null);

    // Non-sensical
    _assert2.default.strictEqual(_.indexjs.getType(null), null);
    _assert2.default.strictEqual(_.indexjs.getType(undefined), null);
    _assert2.default.strictEqual(_.indexjs.getType(42), null);
    _assert2.default.strictEqual(_.indexjs.getType({}), null);

    // File paths
    _assert2.default.equal(_.indexjs.getType('dir/text.txt'), 'text/plain');
    _assert2.default.equal(_.indexjs.getType('dir\\text.txt'), 'text/plain');
    _assert2.default.equal(_.indexjs.getType('.text.txt'), 'text/plain');
    _assert2.default.equal(_.indexjs.getType('.txt'), 'text/plain');
    _assert2.default.equal(_.indexjs.getType('txt'), 'text/plain');
    _assert2.default.equal(_.indexjs.getType('/path/to/page.html'), 'text/html');
    _assert2.default.equal(_.indexjs.getType('c:\\path\\to\\page.html'), 'text/html');
    _assert2.default.equal(_.indexjs.getType('page.html'), 'text/html');
    _assert2.default.equal(_.indexjs.getType('path/to/page.html'), 'text/html');
    _assert2.default.equal(_.indexjs.getType('path\\to\\page.html'), 'text/html');
    _assert2.default.strictEqual(_.indexjs.getType('/txt'), null);
    _assert2.default.strictEqual(_.indexjs.getType('\\txt'), null);
    _assert2.default.strictEqual(_.indexjs.getType('text.nope'), null);
    _assert2.default.strictEqual(_.indexjs.getType('/path/to/file.bogus'), null);
    _assert2.default.strictEqual(_.indexjs.getType('/path/to/json'), null);
    _assert2.default.strictEqual(_.indexjs.getType('/path/to/.json'), null);
    _assert2.default.strictEqual(_.indexjs.getType('/path/to/.config.json'), 'application/json');
    _assert2.default.strictEqual(_.indexjs.getType('.config.json'), 'application/json');
  });

  it('getExtension()', function () {
    _assert2.default.equal(_.indexjs.getExtension('text/html'), 'html');
    _assert2.default.equal(_.indexjs.getExtension(' text/html'), 'html');
    _assert2.default.equal(_.indexjs.getExtension('text/html '), 'html');
    _assert2.default.strictEqual(_.indexjs.getExtension('application/x-bogus'), null);
    _assert2.default.strictEqual(_.indexjs.getExtension('bogus'), null);
    _assert2.default.strictEqual(_.indexjs.getExtension(null), null);
    _assert2.default.strictEqual(_.indexjs.getExtension(undefined), null);
    _assert2.default.strictEqual(_.indexjs.getExtension(42), null);
    _assert2.default.strictEqual(_.indexjs.getExtension({}), null);
  });
});

describe('DB', function () {
  var diffs = [];

  after(function () {
    if (diffs.length) {
      console.log('\n[INFO] The following inconsistencies with MDN (https://goo.gl/lHrFU6) and/or mime-types (https://github.com/jshttp/mime-types) are expected:');
      diffs.forEach(function (d) {
        console.warn('  ' + d[0] + '[' + _chalk2.default.blue(d[1]) + '] = ' + _chalk2.default.red(d[2]) + ', mime[' + d[1] + '] = ' + _chalk2.default.green(d[3]));
      });
    }
  });

  it('Consistency', function () {
    for (var ext in this.types) {
      _assert2.default.equal(ext, this.extensions[this.types[ext]], '${ext} does not have consistent ext->type->ext mapping');
    }
  });

  it('MDN types', function () {
    // MDN types listed at https://goo.gl/lHrFU6
    var MDN = {
      aac: 'audio/aac',
      abw: 'application/x-abiword',
      arc: 'application/x-freearc',
      avi: 'video/x-msvideo',
      azw: 'application/vnd.amazon.ebook',
      bin: 'application/octet-stream',
      bmp: 'image/bmp',
      bz: 'application/x-bzip',
      bz2: 'application/x-bzip2',
      csh: 'application/x-csh',
      css: 'text/css',
      csv: 'text/csv',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      eot: 'application/vnd.ms-fontobject',
      epub: 'application/epub+zip',
      gz: 'application/gzip',
      gif: 'image/gif',
      htm: 'text/html',
      html: 'text/html',
      ico: 'image/vnd.microsoft.icon',
      ics: 'text/calendar',
      jar: 'application/java-archive',
      jpeg: 'image/jpeg',
      jpg: 'image/jpeg',
      js: 'text/javascript',
      json: 'application/json',
      jsonld: 'application/ld+json',
      mid: 'audio/x-midi',
      midi: 'audio/x-midi',
      mjs: 'text/javascript',
      mp3: 'audio/mpeg',
      mpeg: 'video/mpeg',
      mpkg: 'application/vnd.apple.installer+xml',
      odp: 'application/vnd.oasis.opendocument.presentation',
      ods: 'application/vnd.oasis.opendocument.spreadsheet',
      odt: 'application/vnd.oasis.opendocument.text',
      oga: 'audio/ogg',
      ogv: 'video/ogg',
      ogx: 'application/ogg',
      opus: 'audio/opus',
      otf: 'font/otf',
      png: 'image/png',
      pdf: 'application/pdf',
      php: 'application/php',
      ppt: 'application/vnd.ms-powerpoint',
      pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      rar: 'application/vnd.rar',
      rtf: 'application/rtf',
      sh: 'application/x-sh',
      svg: 'image/svg+xml',
      swf: 'application/x-shockwave-flash',
      tar: 'application/x-tar',
      tif: 'image/tiff',
      tiff: 'image/tiff',
      ts: 'video/mp2t',
      ttf: 'font/ttf',
      txt: 'text/plain',
      vsd: 'application/vnd.visio',
      wav: 'audio/wav',
      weba: 'audio/webm',
      webm: 'video/webm',
      webp: 'image/webp',
      woff: 'font/woff',
      woff2: 'font/woff2',
      xhtml: 'application/xhtml+xml',
      xls: 'application/vnd.ms-excel',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      xml: 'application/xml',
      xul: 'application/vnd.mozilla.xul+xml',
      zip: 'application/zip',
      '3gp': 'video/3gpp',
      '3g2': 'video/3gpp2',
      '7z': 'application/x-7z-compressed'
    };

    for (var ext in MDN) {
      var expected = MDN[ext];
      var actual = _.indexjs.getType(ext);
      if (actual !== expected) diffs.push(['MDN', ext, expected, actual]);
    }

    for (var ext in mimeTypes.types) {
      var expected = mimeTypes.types[ext];
      var actual = _.indexjs.getType(ext);
      if (actual !== expected) diffs.push(['mime-types', ext, expected, actual]);
    }
  });

  it('Specific types', function () {
    // Assortment of types we sanity check for good measure
    _assert2.default.equal(_.indexjs.getType('html'), 'text/html');
    _assert2.default.equal(_.indexjs.getType('js'), 'application/javascript');
    _assert2.default.equal(_.indexjs.getType('json'), 'application/json');
    _assert2.default.equal(_.indexjs.getType('rtf'), 'application/rtf');
    _assert2.default.equal(_.indexjs.getType('txt'), 'text/plain');
    _assert2.default.equal(_.indexjs.getType('xml'), 'application/xml');

    _assert2.default.equal(_.indexjs.getType('wasm'), 'application/wasm');
  });

  it('Specific extensions', function () {
    _assert2.default.equal(_.indexjs.getExtension('text/html;charset=UTF-8'), 'html');
    _assert2.default.equal(_.indexjs.getExtension('text/HTML; charset=UTF-8'), 'html');
    _assert2.default.equal(_.indexjs.getExtension('text/html; charset=UTF-8'), 'html');
    _assert2.default.equal(_.indexjs.getExtension('text/html; charset=UTF-8 '), 'html');
    _assert2.default.equal(_.indexjs.getExtension('text/html ; charset=UTF-8'), 'html');
    _assert2.default.equal(_.indexjs.getExtension(_.indexjs._types.text), 'txt');
    _assert2.default.equal(_.indexjs.getExtension(_.indexjs._types.htm), 'html');
    _assert2.default.equal(_.indexjs.getExtension('application/octet-stream'), 'bin');
    _assert2.default.equal(_.indexjs.getExtension('application/octet-stream '), 'bin');
    _assert2.default.equal(_.indexjs.getExtension(' text/html; charset=UTF-8'), 'html');
    _assert2.default.equal(_.indexjs.getExtension('text/html; charset=UTF-8 '), 'html');
    _assert2.default.equal(_.indexjs.getExtension('text/html; charset=UTF-8'), 'html');
    _assert2.default.equal(_.indexjs.getExtension('text/html ; charset=UTF-8'), 'html');
    _assert2.default.equal(_.indexjs.getExtension('text/html;charset=UTF-8'), 'html');
    _assert2.default.equal(_.indexjs.getExtension('text/Html;charset=UTF-8'), 'html');
    _assert2.default.equal(_.indexjs.getExtension('unrecognized'), null);

    _assert2.default.equal(_.indexjs.getExtension('text/xml'), 'xml'); // See #180
  });
});