#! /usr/local/bin/node

require('neon');

var Firebase = require('firebase'),
    myFirebaseRef = new Firebase("https://toily-map-data.firebaseio.com/");


Class('AddSatData')({
    prototype : {

        init : function init(config){

            Object.keys(config || {}).forEach(function (property) {
                this[property] = config[property];
            }, this);

            myFirebaseRef.child(this.mapCellId).once('value', this._getRecordValue.bind(this));

            return true;
        },

        _getRecordValue : function _getRecordValue(snapshot){
            // console.log('worker['+this.id+']: ', snapshot.val());
            myFirebaseRef.child(this.mapCellId+'/data').update({
                layers : ['url(/assets/img/maps/sat.png) {pos} no-repeat']
            }, function(error){
                if(error){
                    throw error;
                }
                setTimeout(function(){
                    console.log('worker['+__filename+'] done: ', this.mapCellId);
                    process.exit(0);
                }, Math.floor(Math.random() * 5000) + 1000);
            });

        }
    }
});

var addSatData = new AddSatData({
    mapCellId : process.argv[2]
});