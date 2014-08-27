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
    addPortrait(charData);
});


var addPortrait = function(){
    charData.data.portrait = 'http://toily.mx/files/'+charData.meta.charType+'-'+Math.floor(Math.random()*2)+'.png';
    charData.jobs.shift();
    if(charData.jobs.length === 0){
        charData.status = 'complete';
    }
        // console.log('addPortrait', charData.jobs);
    myFirebaseRef.child(charData.id).update(charData, function(snap){
        process.exit(0);
    });
};