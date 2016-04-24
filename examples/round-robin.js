var visigoth = require('../visigoth')();

// We add two upstreams with the default algorithm: round-robin
visigoth.add('upstream1');
visigoth.add('upstream2');

for (var i = 0; i < 100; i++) {
  visigoth.choose(function(upstream, stats) {
      console.log(upstream);
  });
}
