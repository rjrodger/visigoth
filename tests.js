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

    it("lastChoosenTimestamp should be null if the node was never choosen (just added)", function(){
        var visigoth = require('./visigoth')();
        visigoth.add("I am a node");
        expect(visigoth.upstreams$[0].meta$.lastChoosenTimestamp).to.equal(null);
    });
});

describe('remove targets', function() {
    it('removes a string target', function () {
        var visigoth = require('./visigoth')();
        visigoth.add("target 1");
        visigoth.add("target 2");
        visigoth.remove("target 1");
        expect(visigoth.upstreams$.length).to.equal(1);
        expect(visigoth.upstreams$[0].target).to.equal("target 2");
    });

    it('removes a function target', function () {
        var visigoth = require('./visigoth')();
        var a = new function() {return "a";};
        var b = new function() {return "b";};
        visigoth.add(a);
        visigoth.add(b);
        visigoth.remove(a);
        expect(visigoth.upstreams$[0].target).to.equal(b);
    });

    it('removes an object target', function () {
        var visigoth = require('./visigoth')();
        var a = {a: "a"};
        var b = {b: "b"};
        visigoth.add(a);
        visigoth.add(b);
        visigoth.remove(b);
        expect(visigoth.upstreams$[0].target).to.equal(a);
    });
});

describe('choose target', function () {
    it('chooses a target when there is at least one available', function(done) {
        var visigoth = require('./visigoth')();
        visigoth.add("node one");
        visigoth.choose(function(error, target) {
          expect(error).to.be.null;
          expect(target).to.equal("node one");
          done();
        });
    });

    it('fails when there are no targets', function(done) {
        var visigoth = require('./visigoth')();
        visigoth.choose(function(error, target, errored, stats) {
            expect(error).to.not.be.null;
            expect(target).to.be.undefined;
            expect(errored).to.be.undefined;
            expect(stats).to.be.undefined;
            done();
        });
    });

    it('marks the node as "HALF-OPEN" once the timeout has expired', function(done) {
        var clock = sinon.useFakeTimers();

        var visigoth = require('./visigoth')({closingTimeout: 300});

        visigoth.add("test target");
        visigoth.add("test target 2");
        visigoth.choose(function(err, target, errored) {
            errored();
        });

        clock.tick(300);
        visigoth.choose(function(err, target) {
            expect(target).to.equal('test target 2');
            expect(visigoth.upstreams$[0].meta$.status).to.equal('OPEN');
            clock.tick(1);
            visigoth.choose(function(err, target) {
                expect(target).to.equal('test target');
                expect(visigoth.upstreams$[0].meta$.status).to.equal('HALF-OPEN');
                done();
            });
        });
    });
});
