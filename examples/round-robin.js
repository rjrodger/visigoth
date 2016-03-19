var visigoth = require('../visigoth')();

// We add two upstreams with the default algorithm: round-robin
visigoth.add('upstream1');
visigoth.add('upstream2');

visigoth.choose(function(upstream, stats) {
    console.log(upstream);
});

visigoth.choose(function(upstream, stats) {
    console.log(upstream);
});

visigoth.choose(function(upstream, stats) {
    console.log(upstream);
});
