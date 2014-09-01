Class('DroneSimulator').inherits(Widget)({
    ELEMENT_CLASS : 'column fixed drone-simulator',
    HTML: '<div>\
        <div class="controls">\
            <a href="javascript:void(0);" class="button launch">Launch</a>\
            <a href="javascript:void(0);" class="button reset hidden">Reset</a>\
            <div class="stations-container">\
                <div class="drone-stations"></div>\
            </div>\
            <div class="clearfix"></div>\
        </div>\
    </div>',

    prototype : {

        _desiredDrones: 2,
        _picturesPerStation: 5,
        _droneStations: [],

        init : function(config){
            var i, newDroneStation;
            Widget.prototype.init.call(this, config);

            this.launchEl = this.element.find('.launch');
            this.resetEl = this.element.find('.reset');
            this.baseMapEl = this.element.find('.base');
            this.dataMapEl = this.element.find('.data');
            this.droneStationsEl = this.element.find('.drone-stations');

            this.map = new Map();
            this.map.render(this.element);

            for(var i=0; i<this._desiredDrones; i+=1){
                newDroneStation = new DroneStation({
                    status: 'waiting'
                });
                this._droneStations.push(newDroneStation);
                newDroneStation.render(this.droneStationsEl);
            }

            this._bindEvents();
        },

        _bindEvents : function _bindEvents(){
            this.launchEl.click(this._handleLaunch.bind(this));
            this.resetEl.click(this._handleReset.bind(this));

            this._droneStations.forEach(function(droneStation){
                droneStation.bind('batch:complete', this._deployDrones.bind(this));
            }, this);
        },

        _handleLaunch : function _handleLaunch(){
            this.launchEl.toggle();
            this.resetEl.toggle();
            this._deployDrones();
        },

        _handleReset : function _handleReset(){
            location.reload();
            // this.launchEl.toggle();
            // this.resetEl.toggle();
            // this.map.reset();
        },

        _deployDrones : function _deployDrones(ev){
            var batchForDrone;

            //send data if any
            if(ev){
                this._sendImagesForProcessing(ev.data);
            }

            this._droneStations.forEach(function(droneStation){
                if(droneStation.status === 'waiting'){
                    batchForDrone = this.map.getPendingCellMaps(this._picturesPerStation);
                    if(batchForDrone){
                        droneStation.deployDrone(batchForDrone);
                    }
                }
            }, this);
        },

        _sendImagesForProcessing : function _sendImagesForProcessing(processedMapCells){
            var processedMapCellIds = [];

            processedMapCells.forEach(function(mapCell){
                processedMapCellIds.push(mapCell.id);
            });

            app.socket.emit('batch:complete', {data: processedMapCellIds});
        },

        mapCellFailed : function mapCellFailed(data){
            console.log('>>>> Failed map cell:', data);
        }
    }
});