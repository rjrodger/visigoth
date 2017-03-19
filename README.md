# Visigoth
Visgoth is a multipurpose load balancer with circuit breaking capabilities.
By default, it provides a round-robin strategy that will work in the majority of the situations.

Visigoth allows you to customize the strategy for choosing the healthiest target
by evaluating the statistics recorded by previous calls to the same target:

```
function rater(upstream) {
    var responseTime = upstream.meta$.stats.responseTime;
    if(typeof responseTime !== 'undefined') {
        return 3000 - upstream.meta$.stats.responseTime;
    } else {
        return 1;
    }
}

var visigoth = require('../../visigoth')({customRater: rater});

visigoth.choose(function(target, errored, stats) {
    console.log(target);
    if (target === "slow-upstream") {
        stats.responseTime = 3001;
    } else {
        stats.responseTime = 100;
    }
    callback();
});
```
For more info on how to use it give a look to the folder [examples](examples) that contains
few use cases explained step by step.

# The Team
- David Gonzalez david.gonzalez@nearform.com
- Richard Rodger richard.rodger@nearform.com

# Acknowledgements
This project was sponsored by [nearForm](http://www.nearform.com)

# License
Licensed under [MIT](LICENSE)
