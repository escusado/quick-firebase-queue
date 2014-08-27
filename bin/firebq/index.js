#! /usr/local/bin/node

var fs = require('fs');

//Config
var serverPort = 3000,
    boriumConf = JSON.parse(fs.readFileSync(__dirname+'/../borium-conf.json'));

var firebqServer = require('./FirebqServer.js').FirebqServer.config(boriumConf);

require('neon'); //Class syntax sugar DSL


Class('FireBq')({
    prototype : {

        _jobTypes : {},

        init : function init(config){

            Object.keys(config || {}).forEach(function (property) {
                this[property] = config[property];
            }, this);

            firebqServer.start(
                {
                    workers : {
                        addName : __dirname+'/../characterCreator/workers/addName.js',
                        addStats : __dirname+'/../characterCreator/workers/addStats.js',
                        addAge : __dirname+'/../characterCreator/workers/addAge.js'
                    }
                }
            );

            return true;
        }
    }
});

var fireBq = new FireBq();