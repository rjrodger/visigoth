

module.exports = function(options) {
    var customRater = undefined;
    if (typeof options !== 'undefined') {
        customRater = options.customRater;
    }
    
    return {
        // By default, round robin.
        upstreamRater$ : customRater || roundRobin,
        upstreams$ : [],
        lastChoosenIndex$ : null, 
        add : api_add,
        remove : api_remove,
        choose : api_choose
    };
}

var _ = require("lodash");

/**
 * Round Robin algorithm
 */
function roundRobin(upstream) {
    return Date.now() - upstream.meta$.lastChoosenTimestamp;
}

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
    this.upstreams$.push(upstream);
}

/**
 * Removes one upstream from the list.
 */
function api_remove(upstream) {
    var me = this;
    me.upstreams$ = _.reject(me.upstreams$, function(e) {
        return _.isEqual(e, upstream.target);
    });
}

/**
 * This function chooses one upstream based on a score given by a function
 * that the user will pass as a parameter to visigoth. This function will iterate
 * over the upstreams and return the one with a higher score. 
 */
function api_choose(callback) {
    var me = this;
    var bestNode = 0;
    var bestScore = Number.MIN_SAFE_INTEGER;
    _(me.upstreams$).forEach(function(upstream, index) {
        var current = me.upstreamRater$(upstream, index, me.upstreams$);
        if (current > bestScore && upstream.meta$.status != "OPEN") {
            bestScore = current;
            bestNode = index;
        }
    });
    // No healthy nodes available.
    if (bestScore < 0) {
        return null;
    } else {
        // When was the node choosen the last time:
        me.upstreams$[bestNode].meta$.lastChoosenTimestamp = Date.now();
        // Which node was the last choosen:
        me.lastChoosenIndex$ = bestNode;
        // Now we inform about the choosen node, with the stats of the node:
        try {
            callback(me.upstreams$[bestNode].target, me.upstreams$[bestNode].meta$.stats);
        } catch(err) {
            me.upstreams$[bestNode].meta$.status = "OPEN";
        }
    }
}
