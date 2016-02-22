var expect = require("chai").expect;

describe('add targets', function() {
    it("should add a target", function() {
        var visigoth = require('./visigoth')();
        visigoth.add("I am a node");
        expect(visigoth.upstreams[0].target).to.equal("I am a node");
        expect(visigoth.upstreams.length).to.equal(1);
    });
    
    it("should not add target if argument is null", function() {
        
    });
});
