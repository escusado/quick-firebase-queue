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
    addName(charData);
});


var names = {
        hero: [
            'Achilles',
            'Agamemnon',
            'Ajax',
            'Ajax the Lesser',
            'Amycus',
            'Atlas',
            'Actaeon',
            'Admetus',
            'Adonis',
            'Capaneus',
            'Castor and Pollux',
            'Jason',
            'Asklepios',
            'Eteocles',
            'Amphiaraus',
            'Hercle',
            'Lynceus',
            'Meleager',
            'Nestor',
            'Menelaus'
        ],

        enemy : [
            'Palamedes',
            'Patroclus',
            'Peleus',
            'Perseus',
            'Phaon',
            'Phoenix',
            'Prometheus',
            'Castor and Pollux',
            'Sisyphus',
            'Daedalus',
            'Teucer',
            'Telamon',
            'Tiresias',
            'Theseus',
            'Dioscuri',
            'Tyndareus',
            'Tydeus',
            'Orpheus',
            'Orestes',
            'Odysseus'
        ]
};

var addName = function(charData){
    charData.data.meta.name = names[charData.data.meta.charType][Math.floor(Math.random()*20)];


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