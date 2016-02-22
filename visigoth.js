
module.exports = function(options) {
    return {
        // By default, round robin.
        upstreamRater : function(upstream) {
            return Date.now() - upstream.meta$.lastChoosenTimestamp;
        },
        algorithm : {},
        upstreams : [],
        add : api_add,
        remove : api_remove,
        choose : api_choose
    };
}

var _ = require("lodash");

/**
 * Adds one upstream to the list.
 */
function api_add(target) {
    var upstream = {};
    // Meta information about the upstream.
    upstream.meta$ = {};
    // Statistics about the upstream. Here is where the user pushes data.
    upstream.meta$.stats = {};
    upstream.meta$.status = "CLOSED";
    upstream.meta$.lastChoosenTimestamp = null;
    upstream.target = target;
    this.upstreams.push(upstream);
}

/**
 * Removes one upstream from the list.
 */
function api_remove(upstream) {
    var me = this;
    me.upstreams = _.reject(me.upstreams, function(e) {
        return _.isEqual(e, upstream.target);
    });
}

/**
 * This function chooses one upstream based on a score given by a function
 * that the user will pass as a parameter to visigoth. This function will iterate
 * over the upstreams and return the one with a higher score. 
 */
function api_choose() {
    var me = this;
    var bestNode = 0;
    var bestScore = Number.MIN_SAFE_INTEGER;
    _(me.upstreams).forEach(function(upstream, index) {
        var current = me.upstreamRater(upstream);
        if (current > bestScore && upstream.meta$.status != "OPEN") {
            bestScore = current;
            bestNode = index;
        }
    });
    // No healthy nodes available.
    if (bestScore <= 0) {
        return null;
    } else {
        me.upsteams[bestNode].meta$.lastChoosenTimestamp = Date.now();
        return me.upstreams[bestNode];
    }
}
