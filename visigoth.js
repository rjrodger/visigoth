
module.exports = {
    // This function will rate how healthy an endpoint is 
    upstreamRater : function(upstream) {
        return 1;
    },
    algorithm : {},
    upstreams : [],
    add : api_add,
    remove : api_remove,
    choose : api_choose
};

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
        if (current > bestScore) {
            bestScore = current;
            bestNode = index;
        }
    });
    // If the score is 0 or less... we cannot trust the node.
    return bestScore <= 0 ? null : me.upstreams[bestNode];
}

var visigoth = module.exports;
