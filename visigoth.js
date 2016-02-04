
module.exports = {
    stats : {},
    algorithm : {},
    upstreams : [],
    add : api_add,
    remove : api_remove,
    choose : api_choose
};

var _ = require("lodash");

function api_add(upstream) {
    // TODO David: add meta and stats.
    this.upstreams.push(upstream);
}

function api_remove(upstream) {
    var me = this;
    me.upstreams = _.reject(me.upstreams, function(e) {
        return _.isEqual(e, upstream);
    });
}

function api_choose() {

}


var visigoth = module.exports;

visigoth.add("bananas");
visigoth.add("tomatos");

visigoth.remove("peras");

console.log(visigoth.upstreams);
