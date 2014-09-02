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
        _jobs    : [],

        init : function(config){
            Widget.prototype.init.call(this, config);

            this.myFirebaseRef = new Firebase("https://toily-firebq-storage.firebaseio.com/");

            this.workerContainerEl = this.element.find('.worker-container')
            this.jobsContainerEl = this.element.find('.worker-container')

            this._bindEvents();
        },

        _bindEvents : function _bindEvents(){
            this.myFirebaseRef.on('value', this._handleDatabaseUpdate.bind(this));
        },

        _handleDatabaseUpdate : function(snapshot){
            var newJob,
                updatedJobs = [],
                jobs = snapshot.val();

            if(jobs){ //database has values in it

                if(this._jobs.length){
                    //jobs already here, just update
                    Object.keys(jobs).forEach(function(jobId, i){
                        this._jobs[jobId].update({
                            id: jobId,
                            data: jobs[jobId]
                        });
                        updatedJobs.push(jobId);
                    }, this);

                    this._removeNotUpdatedJobs(updatedJobs);

                }else{
                    //no jobs? create them then
                    Object.keys(jobs).forEach(function(jobId, i){
                        var job = jobs[jobId],
                            newJob = new Job({
                                id : jobId,
                                data : job
                            });
                        this._jobs[jobId] = newJob;
                        newJob.render(this.jobsContainerEl);
                    }, this);
                }

            }

        },

        update : function update(stat){
            var newWorker,
                data = JSON.parse(stat.data);

            if(this._workers.length){
                //workers already here, just update
                data.workers.forEach(function(worker, i){

                    this._workers[i].update({
                        data: worker
                    });

                }, this);

            }else{
                //no workers? create them then
                data.workers.forEach(function(worker, i){
                    newWorker = new Worker({
                        id : i,
                        data : worker
                    });
                    this._workers.push(newWorker);
                    newWorker.render(this.workerContainerEl);
                }, this);
            }

        },

        _removeNotUpdatedJobs : function _removeNotUpdatedJobs(updatedJobs){
            Object.keys(this._jobs).forEach(function(jobId){
                // var jobWidget = this._jobs[jobWidgetId];
                if(updatedJobs.indexOf(jobId) < 0){
                    this._jobs[jobId].destroy();
                }
            }, this);
        }
    }
});