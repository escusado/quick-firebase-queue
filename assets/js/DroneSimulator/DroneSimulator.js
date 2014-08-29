Class('DroneSimulator').inherits(Widget)({
    ELEMENT_CLASS : 'column fixed drone-simulator',
    HTML: '<div>\
        <div class="controls">\
            <div class="drone-stations"></div>\
            <a href="javascript:void(0);" class="launch">Launch</a>\
        </div>\
    </div>',

    prototype : {

        _desiredDrones: 1,
        _picturesPerStation: 5,
        _droneStations: [],

        init : function(config){
            var i, newDroneStation;
            Widget.prototype.init.call(this, config);

            this.launchEl = this.element.find('.launch');
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
            this.launchEl.click(this._deployDrones.bind(this));

            this._droneStations.forEach(function(droneStation){
                droneStation.bind('batch:complete', this._deployDrones.bind(this));
            }, this);
        },

        _deployDrones : function _deployDrones(){
            var destinationPoints, batchForDrone;

            this._droneStations.forEach(function(droneStation){
                if(droneStation.status === 'waiting'){
                    debugger
                    batchForDrone = this.map.getPendingCellMaps(this._picturesPerStation);
                    droneStation.deployDrone(batchForDrone);
                }
            }, this);
        }
    }
});