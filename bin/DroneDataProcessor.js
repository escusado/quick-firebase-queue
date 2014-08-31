var postal = require('postal'),
    firebqChannel = postal.channel('firebq');

Class('DroneDataProcessor')({
    prototype : {

        jobs : {
            //job name      , workers order
            processMapCell : ['addSatData.js', 'addHeatData.js', 'addPointData.js']
        },

        _pendingImages : {},

        init : function init(config){

            Object.keys(config || {}).forEach(function (property) {
                this[property] = config[property];
            }, this);

            this._bindEvents();

            return true;
        },

        _bindEvents : function _bindEvents(){
            //listen to firebq job done event
            firebqChannel.subscribe('job:done', this._handleJobDone.bind(this));
        },

        enqueMapCellData : function enqueMapCellData(map){
            this._pendingImages[map] = this.jobs.processMapCell.slice(0);
            this._processNew();
        },

        _processNew : function _processNew(){
            Object.keys(this._pendingImages).forEach(function(mapCellId){
                var pendingWorker = this._pendingImages[mapCellId];

                //if image is new (has all the jobs)
                if(pendingWorker.length === this.jobs.processMapCell.length){
                    console.log('pending job!', this.jobs.processMapCell.length);
                    //push new job to firebq
                    firebqChannel.publish('enque:job', pendingWorker.pop()+':'+mapCellId);
                }

            }, this);
        },

        _handleJobDone : function _handleJobDone(data, envelope){
            //on job done, queue next job
            console.log('job done!', data);
            firebqChannel.publish('enque:job',  this._pendingImages[data.mapCellId].pop()+':'+data.mapCellId);
        }
    }
});
