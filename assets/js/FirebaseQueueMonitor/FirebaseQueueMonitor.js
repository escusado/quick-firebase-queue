Class('FirebaseQueueMonitor').inherits(Widget)({
    ELEMENT_CLASS : 'column elastic firebase-queue-monitor',
    HTML: '<div>\
        <div class="controls">\
            <div class="title">Queue workers</div>\
            <div class="worker-container"></div>\
            <div class="clearfix"></div>\
        </div>\
        <div class="jobs-container"></div>\
    </div>',

    prototype : {

        myFirebaseRef : null,

        _workers : [],
        _jobs    : {},

        init : function(config){
            Widget.prototype.init.call(this, config);

            this.myFirebaseRef = new Firebase("https://toily-firebq-storage.firebaseio.com/");

            this.workerContainerEl = this.element.find('.worker-container')
            this.jobsContainerEl = this.element.find('.jobs-container')

            this._bindEvents();
        },

        _bindEvents : function _bindEvents(){
            this.myFirebaseRef.on('value', this._handleDatabaseUpdate.bind(this));
        },

        _handleDatabaseUpdate : function(snapshot){
            var newJob,
                updatedJobs = [],
                jobs = snapshot.val();

            if(jobs){
                Object.keys(jobs).forEach(function(jobId, i){
                    var updatedJob = this._jobs[jobId];

                    if(updatedJob){
                        this._jobs[jobId].update({
                            data: jobs[jobId]
                        });
                        updatedJobs.push(jobId);
                    }else{
                        var job = jobs[jobId],
                            newJob = new Job({
                                id : jobId,
                                data : job
                            });
                        this._jobs[jobId] = newJob;
                        newJob.render(this.jobsContainerEl);
                    }
                }, this);

                if(updatedJobs.length){
                    this._removeNotUpdatedJobs(updatedJobs);
                }
            }else{
                this._removeNotUpdatedJobs(updatedJobs);
            }

        },

        update : function update(stat){
            var newWorker,
                data = JSON.parse(stat.data);

            data.workers.forEach(function(worker, i){

                if(this._workers[i]){
                    this._workers[i].update({
                        data: worker
                    });
                }else{
                    newWorker = new Worker({
                        id : i,
                        data : worker
                    });
                    this._workers.push(newWorker);
                    newWorker.render(this.workerContainerEl);
                }

            }, this);
        },

        _removeNotUpdatedJobs : function _removeNotUpdatedJobs(updatedJobs){
            Object.keys(this._jobs).forEach(function(jobId){

                if(updatedJobs.indexOf(jobId) < 0){
                    var removingJob = this._jobs[jobId];

                    removingJob.destroy();

                    delete this._jobs[jobId];
                }

            }, this);
        }
    }
});