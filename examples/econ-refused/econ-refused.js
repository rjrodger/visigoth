var visigoth = require('../../visigoth')();
var request = require('request');
var async = require('async');

function handleRequest(request, response) {
    response.end('Here we are!');
}


// Add two endpoints, localhost will fail as no one is listening in there...
visigoth.add("http://localhost:1233");
visigoth.add("http://www.google.com");


// First, show 
console.log(visigoth.upstreams$);


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
    console.log(visigoth.upstreams$);
});
