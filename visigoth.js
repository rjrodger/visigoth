
module.exports = function(options) {
    var customRater = undefined;
    var closingTimeout = undefined;
    if (typeof options !== 'undefined') {
        customRater = options.customRater;
        closingTimeout = options.closingTimeout;
    }
    
    return {
        // By default, round robin.
        upstreamRater$ : customRater || roundRobin,
        upstreams$ : [],
        // 30 seconds by default
        closingTimeout$: closingTimeout || 30000,
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
    upstream.meta$.statusTimestamp = Date.now();
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
        return _.isEqual(e.target, upstream);
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
        // Re-closing if the timeout has expired;
        if (upstream.meta$.status == 'OPEN') {
            if ((Date.now() - upstream.meta$.statusTimestamp) > me.closingTimeout$) {
                upstream.meta$.status = 'HALF-OPEN';
            }
        }
        // TODO David: Think about what we pass in here.
        var current = me.upstreamRater$(upstream, index, me.upstreams$);
        if (current > bestScore && upstream.meta$.status != "OPEN") {
            bestScore = current;
            bestNode = index;
        }
    });

    if (bestScore < 0) {
        throw "no healthy nodes available";
    } else {
        me.upstreams$[bestNode].meta$.lastChoosenTimestamp = Date.now();
        me.lastChoosenIndex$ = bestNode;
        try {
            callback(me.upstreams$[bestNode].target, me.upstreams$[bestNode].meta$.stats);
        } catch(err) {
            me.upstreams$[bestNode].meta$.status = "OPEN";
            me.upstreams$[bestNode].meta$.statusTimestamp = Date.now();
        }
        if (me.upstreams$[bestNode].meta$.status == "HALF-OPEN") {
            me.upstreams$[bestNode].meta$.status = "CLOSED";
        }
    }
}
