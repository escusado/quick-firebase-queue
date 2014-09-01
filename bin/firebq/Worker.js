var workerDir = '/../workerScripts/';

var sys = require('sys'),
    exec = require('child_process').exec;

Class('Worker').includes(CustomEventSupport)({
    prototype : {
        currentJob: null,

        init : function init(config){

            Object.keys(config || {}).forEach(function (property) {
                this[property] = config[property];
            }, this);

            console.log('new Worker: ', this.id);

            return true;
        },

        execJob : function execJob(data){
            //parse data
            var script = data.job.split(':')[0],
                firebaseDataset = data.job.split(':')[1],
                command = workerDir+script+' '+firebaseDataset;

            //set state for further inspection by queue engine
            this.currentJob = data.job;
            this.currentJobId = data.id;

            command = __dirname+command;
            console.log('command: ', command);
            exec(command, function(error, stdout, stderr){
                //report error
                if(error){
                    this.dispatch('job:error', {
                        data : {
                            workerId : this.id,
                            error: error.toString()
                        }
                    });
                    console.log('worker['+this.id+'] error: ', error.toString());
                    return;
                }

                if(stderr){
                    this.dispatch('job:error', {
                        data:{
                            workerId : this.id,
                            error: tderr.toString()
                        }
                    });
                    console.log('worker['+this.id+'] error: ', stderr.toString());
                    return;
                }

                //report success
                console.log('worker['+this.id+'] done: ', command);
                this.dispatch('job:done', {
                    data:{
                        workerId : this.id
                    }
                });
                return;
            }.bind(this));

        },

        release : function release(){
            this.status = 'free';
            this.currentJob = null;
            this.currentJobId = null;
        }
    }
});