
/*
 * This function returns an integer. This integer will be the score of the
 * target being evaluated within visigoth with two simple rules:
 *   - The highest number is the node being choosen.
 *   - A target with a score of 0 or less will never be choosen.
 */
function rater(upstream) {
    var responseTime = upstream.meta$.stats.responseTime;
    if(typeof responseTime !== 'undefined') {
        return 3000 - upstream.meta$.stats.responseTime;
    } else {
        return 1;
    }
}

var visigoth = require('../../visigoth')({customRater: rater});
visigoth.add("slow-upstream")
visigoth.add("fast-upstream")

var async = require('async');

async.series([
    // Slow-upstream:
    function(callback) {
        visigoth.choose(function(err, target, errored, stats) {
            console.log(target);
            if (target === "slow-upstream") {
                stats.responseTime = 3001;
            } else {
                stats.responseTime = 100;
            }
            callback();
        });
    },
    // Fast-upstream:
    function(callback) {
        visigoth.choose(function(err, target, errored, stats) {
            console.log(target);
            if (target === "slow-upstream") {
                stats.responseTime = 3001;
            } else {
                stats.responseTime = 100;
            }
            callback();
        });
    },
    // Fast-upstream (slow upstream has a very low score now):
    function(callback) {
        visigoth.choose(function(err, target, errored, stats) {
            console.log(target);
            if (target === "slow-upstream") {
                stats.responseTime = 3001;
            } else {
                stats.responseTime = 100;
            }
            callback();
        });
    }
], function() {
    console.log(visigoth.upstreams$);
});
