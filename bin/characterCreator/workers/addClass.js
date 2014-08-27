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
    addClass(charData);
});


var classes = {
        hero: [
            'paladin',
            'warrior',
            'mage'
        ],

        enemy : [
            'zombie',
            'ogre',
            'warlock'
        ]
};

var addClass = function(){
    charData.data.meta.class = classes[charData.data.meta.charType][Math.floor(Math.random()*3)];


    charData.jobs.shift();
    if(charData.jobs.length === 0){
        charData.status = 'complete';
    }

    setTimeout(function(){
        myFirebaseRef.child(charData.id).update(charData, function(snap){
            process.exit(0);
        });
    }, (Math.floor(Math.random()*3)) * 1000);
};