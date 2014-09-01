require('./FirebqCli.js')

Class('DroneDataProcessor').includes(CustomEventSupport)({
    prototype : {

        jobs : {
            //job name      , workers order
            processMapCell : ['addPointData.js', 'addHeatData.js', 'addSatData.js']
        },

        _pendingImages : {},

        init : function init(config){

            Object.keys(config || {}).forEach(function (property) {
                this[property] = config[property];
            }, this);


            this.firebqCli = new FirebqCli();

            this._bindEvents();

            return true;
        },

        _bindEvents : function _bindEvents(){
            //listen to firebq job done event
            this.firebqCli.bind('job:done', this._handleJobDone.bind(this));
            this.firebqCli.bind('job:error', this._handleJobError.bind(this));
        },

        enqueMapCellData : function enqueMapCellData(mapCellId){
            this._pendingImages[mapCellId] = this.jobs.processMapCell.slice(0);
            this._processNew();
        },

        _processNew : function _processNew(){
            Object.keys(this._pendingImages).forEach(function(mapCellId){
                var pendingWorker = this._pendingImages[mapCellId];

                //if image is new (has all the jobs)
                if(pendingWorker.length === this.jobs.processMapCell.length){
                    // console.log('pending job!', this.jobs.processMapCell.length);
                    //push new job to firebq
                    this.firebqCli.enque(pendingWorker.pop()+':'+mapCellId);
                }

            }, this);
        },

        _handleJobDone : function _handleJobDone(jobResult){
            //on job done, queue next job
            var mapCellId = jobResult.data.split(':')[1];
            console.log('>>>>>', jobResult);
            if(this._pendingImages[mapCellId].length){
                console.log('job done!', jobResult.data);
                this.firebqCli.enque(this._pendingImages[mapCellId].pop()+':'+mapCellId);
            }
        },

        _handleJobError : function _handleJobError(jobResult){

            var mapCellId = jobResult.data.split(':')[1];
            this.dispatch('job:error', {data: mapCellId});
        },

        reset: function reset(){
            this._pendingImages = {};
        }
    }
});
