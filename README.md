# Visigoth
Visgoth is a multipurpose circuit breaker. By default, it provides a round-robin
strategy that will work in the majority of the situations.

Visigoth allows you to customize the strategy for choosing the healthier target
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
For more info on how to use it give a look to the folder 'examples' that contains
few use cases explained step by step.

# Feedback
If you have any suggestion please contact:
- david.gonzalez@nearform.com

Pull requests are more than welcome. Also, feel free to raise an issue if you
think that visigoth is misbehaving.
