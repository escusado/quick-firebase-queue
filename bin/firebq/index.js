var clientSocket,
    net = require('net'),
    server = net.createServer(),
    io      = require('socket.io').listen(server),
    Firebase = require("firebase"),
    myFirebaseRef = new Firebase("https://toily-firebq-storage.firebaseio.com/");

require('neon');
require('neon/stdlib');
require('./Worker.js');

Class('Firebq')({
    prototype : {

        workersQuantity : 10, //desired workers for the queue

        _workerPool : [],
        _socketBuffer : '', //buffer socket text commands using separator '\n'

        init : function init(config){

            Object.keys(config || {}).forEach(function (property) {
                this[property] = config[property];
            }, this);

            this._createWorkers();

            this._bindEvents();

            this._startServer();

            return true;
        },

        _bindEvents : function _bindEvents(){
            //get when jobs are changed
            myFirebaseRef.on('value', this._tryToRunPendingJobs.bind(this));
        },

        _startServer : function _startServer(){
            //start socket server
            server.listen(8888, 'localhost');
            console.log('Firebq server listening...');
            server.on('connection', function(socket) {
                clientSocket = socket;
                socket.setEncoding('utf-8');
                socket.on('data', this._handleSocketData.bind(this, socket));
            }.bind(this));
        },

        //instantiate all desired workers and fill the pool
        _createWorkers : function _createWorkers(){
            var newWorker;

            for(var i=0; i<this.workersQuantity; i+=1){
                newWorker = new Worker({
                    id: this.guid(),
                    status: 'free'
                });
                this._workerPool.push(newWorker);

                //we hear the worker when its done or exited on error
                newWorker.bind('job:done', this._handleWorkerDone.bind(this))
                newWorker.bind('job:error', this._handleWorkerError.bind(this))
            }
        },

        _handleSocketData : function _handleSocketData(socket, data){
            this._socketBuffer += data;

            //as the api window is a socket , buffer logic is needed
            while(this._socketBuffer.length){
                var request, data,
                    bufferedCommand = this._socketBuffer.split('\n')[0];

                request = bufferedCommand.split('|')[0]
                data = bufferedCommand.split('|')[1];

                switch (request) {
                    case 'enque:job':
                        console.log('job enqueued', data);
                        myFirebaseRef.push({job: data, status: 'waiting'});
                        break;
                    default:
                        break;
                }

                //remove command from buffer and continue
                this._socketBuffer = this._socketBuffer.replace(bufferedCommand+'\n', '');
            }

        },

        //walk the jobs model searchin for pending jobs
        _tryToRunPendingJobs : function _tryToRunPendingJobs(snapshot){
            var queue = snapshot.val();

            if(queue){
                Object.keys(queue).forEach(function(jobId){
                    var job = queue[jobId],
                        freeWorker = this._getFreeWorker();

                    if(job.status === 'waiting' && freeWorker){
                        //lock worker and set job to processing
                        freeWorker.status = 'processing';
                        myFirebaseRef.child(jobId).update({status: 'processing'}, function(){
                            job.id = jobId;
                            freeWorker.execJob(job); //start worker
                        }.bind(this));
                    }
                }, this);
            }
        },

        _getFreeWorker : function _getFreeWorker(){
            var freeWorker = null;

            this._workerPool.filter(function(worker){
                if(worker.status === 'free'){
                    freeWorker = worker;
                }
            });

            return freeWorker;
        },

        _handleWorkerDone : function _handleWorkerDone(ev){
            var worker = this._getWorkerById(ev.data.workerId),
                doneJob = worker.currentJobId;

            //report done job
            clientSocket.write('job:done|'+worker.currentJob+'\n');

            //free worker
            worker.release();

            //remove job from queue
            myFirebaseRef.child(doneJob).remove();
        },

        _handleWorkerError : function _handleWorkerError(ev){
            var worker = this._getWorkerById(ev.data.workerId),
                doneJob = worker.currentJobId;

            //report error job
            clientSocket.write('job:error|'+worker.currentJob+'\n');

            //free worker
            worker.release();
            //remove job from queue
            myFirebaseRef.child(doneJob).remove();
        },

        _getWorkerById : function _getWorkerById(workerId){
            var requestedWorker = null;
            this._workerPool.forEach(function(worker){
                 if(worker.id === workerId){
                    requestedWorker = worker;
                 }
            });
            return requestedWorker;
        },

        guid : (function() {
          function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                       .toString(16)
                       .substring(1);
          }
          return function() {
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                   s4() + '-' + s4() + s4() + s4();
          };
        })(),

    }
});

var firebq = new Firebq();