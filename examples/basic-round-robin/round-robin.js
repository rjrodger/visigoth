var visigoth = require('../visigoth')();

// We add two upstreams with the default algorithm: round-robin
visigoth.add('upstream1');
visigoth.add('upstream2');

// Now visigoth should alternate between them.
for (var i = 0; i < 100; i++) {
  visigoth.choose(function(upstream, errored, stats) {
      console.log(upstream);
  });
}
