#! /usr/local/bin/node

var Firebase = require("firebase"),
    myFirebaseRef = new Firebase("https://charcreator.firebaseio.com/");
var charData = '';

var self = process.stdin;
self.on('readable', function() {
    var chunk = this.read();
    if (chunk === null) {
        // withoutPipe();
    } else {
       charData += chunk;
    }
});
self.on('end', function() {
    charData = JSON.parse(charData);
    addStats(charData);
});


var multipliers = {
    hero: 10,
    enemy : 5
};

var addStats = function(charData){

    Object.keys(charData.data.stats).forEach(function(key){
        var value = charData.data.stats[key];

        if(value === 'null'){
            value = (Math.floor(Math.random()*5)) * 10;
        }

        charData.data.stats[key] = (value + Math.floor(Math.random()*50)) * (multipliers[charData.data.meta.charType]);
    });

    charData.jobs.shift();
    if(charData.jobs.length === 0){
        charData.status = 'complete';
    }else{
        charData.status = 'waiting';
    }

    setTimeout(function(){
        myFirebaseRef.child(charData.id).update(charData, function(snap){
            process.exit(0);
        });
    }, (Math.floor(Math.random()*3)) * 1000);
};