var clientSocket,
    net = require('net'),
    server = net.createServer(),
    Firebase = require("firebase"),
    myFirebaseRef = new Firebase("https://toily-firebq-storage.firebaseio.com/");

require('neon');
require('neon/stdlib');
require('./Worker.js');

Class('Firebq')({
    prototype : {

        workersQuantity : 2,
        _workerPool : [],
        _socketBuffer : '',

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
            myFirebaseRef.on('value', this._tryToRunPendingJobs.bind(this));
        },

        _startServer : function _startServer(){
            server.listen(8888, 'localhost');
            console.log('Firebq server listening...');
            server.on('connection', function(socket) {
                clientSocket = socket;
                socket.setEncoding('utf-8');
                socket.on('data', this._handleSocketData.bind(this, socket));
            }.bind(this));
        },

        _createWorkers : function _createWorkers(){
            var newWorker;

            for(var i=0; i<this.workersQuantity; i+=1){
                newWorker = new Worker({
                    id: this.guid(),
                    status: 'free'
                });
                this._workerPool.push(newWorker);
                newWorker.bind('job:done', this._handleWorkerDone.bind(this))
                newWorker.bind('job:error', this._handleWorkerError.bind(this))
            }
        },

        _handleSocketData : function _handleSocketData(socket, data){
            this._socketBuffer += data;

            if(this._socketBuffer.indexOf('\n')> -1){
                var bufferedCommand = this._socketBuffer.split('\n')[0],
                    request = bufferedCommand.split('|')[0],
                    data = bufferedCommand.split('|')[1];

                //clean socket buffer
                this._socketBuffer = this._socketBuffer.replace(bufferedCommand+'\n', ''); //clean buffer

                switch (request) {
                    case 'enque:job':
                        myFirebaseRef.push({job: data, status: 'waiting'});
                        break;
                    default:
                        break;
                }
            }
        },

        _tryToRunPendingJobs : function _tryToRunPendingJobs(snapshot){
            var queue = snapshot.val(),
                freeWorker = this._getFreeWorker();

            //if free worker, lets check if there are available jobs
            if(queue && freeWorker){
                Object.keys(queue).forEach(function(jobId){
                    var job = queue[jobId];
                    if(job.status === 'waiting'){
                        myFirebaseRef.child(jobId).update({status: 'processing'});
                        freeWorker.status = 'processing';
                        job.id = jobId;
                        freeWorker.execJob(job);
                    }
                });
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
            var worker = this._getWorkerById(ev.data.workerId);
            clientSocket.write('job:done|'+worker.currentJob);
            myFirebaseRef.child(worker.currentJobId).remove();
            worker.release();
        },

        _handleWorkerError : function _handleWorkerError(ev){
            var worker = this._getWorkerById(ev.data.workerId);
            clientSocket.write('job:error|'+worker.currentJob);
            myFirebaseRef.child(worker.currentJobId).remove();
            worker.release();
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