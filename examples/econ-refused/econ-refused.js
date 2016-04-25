var visigoth = require('../../visigoth')();
var request = require('request');
var async = require('async');

// Add two endpoints, localhost will fail as no one is listening in there...
visigoth.add("http://localhost:1233");
visigoth.add("http://www.google.com");


// First, show all the nodes and their status.
console.log(visigoth.upstreams$);

// Choose a node 3 times, 1 will fail and the two others will be the successful node:
async.series([
    function(callback) {
        visigoth.choose(function(target, errored, stats) {
            request(target, function(error, response, body) {
                console.log("connecting to " + target);
                if (error) {
                    console.log("connection to " + target + " failed!")
                    errored();
                } else {
                    console.log("connection to " + target + " was successful")
                }
                callback();                
            });
        });
    },
    function(callback) {
        visigoth.choose(function(target, errored, stats) {
            request(target, function(error, response, body) {
                console.log("connecting to " + target);
                if (error) {
                    console.log("connection to " + target + " failed!")
                    errored();
                } else {
                    console.log("connection to " + target + " was successful")
                }
                callback();
            });
        });
    },
    function(callback) {
        visigoth.choose(function(target, errored, stats) {
            request(target, function(error, response, body) {
                console.log("connecting to " + target);
                if (error) {
                    console.log("connection to " + target + " failed!")
                    errored();
                } else {
                    console.log("connection to " + target + " was successful")
                }
                callback();
            });
        });
    }
], function(err, result) {
    // Show the node list in after all the executions:
    console.log(visigoth.upstreams$);
});
