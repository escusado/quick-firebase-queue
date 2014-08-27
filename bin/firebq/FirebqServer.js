//Firebase based Borium implementation
var net = require('net'),
    sys = require('sys'),
    exec = require('child_process').exec,
    uuid = require('uuid-v4'),
    Firebase = require("firebase"),
    myFirebaseRef = new Firebase("https://toi-firebasequeue.firebaseio.com/");

var clientSocket = null;

Class('FirebqServer')({
    _jobQueue: [],

    _workers : {
        addName : __dirname+'/../characterCreator/workers/addName.js',
        addStats : __dirname+'/../characterCreator/workers/addStats.js',
        addAge : __dirname+'/../characterCreator/workers/addAge.js'
    },

    config : function config(config){
        this.config = config;
        this._bindEvents();
        return this;
    },

    start : function start(){
        var firebqServer = this,
            counter = 0,
            data = '',
            server = net.createServer();

        server.listen(firebqServer.config.port, 'localhost');
        console.log('Firebq server listening...');
        server.on('connection', function(socket) {
            socket.setEncoding('utf-8');
            socket.on('data', this.put.bind(this));
            clientSocket = socket;
        }.bind(this));
    },

    _bindEvents : function _bindEvents(){
        myFirebaseRef.on('value', this._checkForJobStatus.bind(this));
    },

    put : function put(job){
        var job = {
            type : job.split('|')[0],
            state : job.split('|')[1],
            status : 'waiting'
        };

        this._jobQueue.push(job);
        myFirebaseRef.set(this._jobQueue);
    },

    _checkForJobStatus : function _checkForJobStatus(snapshot){

        if(snapshot.val()){
            this._jobQueue = snapshot.val();

            var command,
                currentJob = this._jobQueue.filter(function(job){
                return job.status === 'waiting';
            })[0];

            if(currentJob){
                currentJob.status = 'processing';
                myFirebaseRef.set(this._jobQueue);
                command = 'echo '+ JSON.stringify(currentJob.state)+'|'+this._workers[currentJob.type];
                // console.log('--', currentJob.type);
                exec(command, function(error, stdout, stderr){
                    // console.log('?', error, stdout, stderr);
                    var jobIndex = this._jobQueue.indexOf(currentJob);
                    this._jobQueue.splice(jobIndex, 1);
                    myFirebaseRef.set(this._jobQueue);
                }.bind(this));
            }
        }
    }
});


exports.FirebqServer = FirebqServer;