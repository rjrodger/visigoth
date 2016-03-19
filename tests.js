var expect = require("chai").expect;
var sinon = require("sinon");

describe('add targets', function() {
    it("should add a target with status 'CLOSED' and set the 'statusTimestamp'", function() {
        
        var visigoth = require('./visigoth')();
        var clock = sinon.useFakeTimers();
        // Tick some msecs just to avoid 0 which could be a default value.
        clock.tick(110);
        
        visigoth.add("I am a node");
        
        expect(visigoth.upstreams$[0].target).to.equal("I am a node");
        expect(visigoth.upstreams$.length).to.equal(1);
        expect(visigoth.upstreams$[0].meta$.status).to.equal("CLOSED");
        expect(visigoth.upstreams$[0].meta$.statusTimestamp).to.equal(clock.now);
        clock.restore();
    });
    
    it("lastChoosenTimestamp should be null if the node was never choosen", function(){
        var visigoth = require('./visigoth')();
        visigoth.add("I am a node");
        expect(visigoth.upstreams$[0].meta$.lastChoosenTimestamp).to.equal(null);
    });
});
