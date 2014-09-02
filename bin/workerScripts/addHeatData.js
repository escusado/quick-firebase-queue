#! /usr/local/bin/node

require('neon');

var Firebase = require('firebase'),
    myFirebaseRef = new Firebase("https://toily-map-data.firebaseio.com/");


Class('AddHeatData')({
    prototype : {

        init : function init(config){

            Object.keys(config || {}).forEach(function (property) {
                this[property] = config[property];
            }, this);

            myFirebaseRef.child(this.mapCellId).once('value', this._getRecordValue.bind(this));

            return true;
        },

        _getRecordValue : function _getRecordValue(snapshot){
            var currentLayers = snapshot.val().data.layers;
            currentLayers.unshift('url(/assets/img/maps/heat.png) {pos} no-repeat');

            //async
                myFirebaseRef.child(this.mapCellId+'/data').update({
                    layers : currentLayers
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

var addHeatData = new AddHeatData({
    mapCellId : process.argv[2]
});