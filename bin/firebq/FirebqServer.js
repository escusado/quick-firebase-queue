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

    _workers : {},

    config : function config(config){
        this.config = config;
        this._bindEvents();
        return this;
    },

    start : function start(config){
        var firebqServer = this,
            counter = 0,
            data = '',
            server = net.createServer();

        this._workers = config.workers;

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

                exec(command, function(error, stdout, stderr){
                    console.log('worker '+currentJob.type+' done, output: ', error, stdout, stderr);
                    var jobIndex = this._jobQueue.indexOf(currentJob);
                    this._jobQueue.splice(jobIndex, 1);
                    myFirebaseRef.set(this._jobQueue);
                }.bind(this));
            }
        }
    }
});


exports.FirebqServer = FirebqServer;