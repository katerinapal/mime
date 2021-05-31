import mod_litejs from "../lite";
import mod_indexjs from "..";
import ext_benchmark from "benchmark";
const Benchmark = ext_benchmark;
const mime = mod_indexjs;
const mimeLite = mod_litejs;

const suite = new Benchmark.Suite();

const extensions = Object.keys(mime._types);
let idx = 0;

suite
  .add('mime.getType',
    function() {
      mime.getType(extensions[idx++]);
      if (idx >= extensions.length) idx = 0;
    }
  )
  .add('mimeLite.getType',
    function() {
      mimeLite.getType(extensions[idx++]);
      if (idx >= extensions.length) idx = 0;
    }
  )
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .run();
