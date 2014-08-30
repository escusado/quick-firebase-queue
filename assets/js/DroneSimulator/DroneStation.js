Class('DroneStation').inherits(Widget)({

    ELEMENT_CLASS: 'drone-station',

    prototype : {

        status: 'waiting', //deployed

        _drone: null,

        init : function(config){
            Widget.prototype.init.call(this, config);

            this.drone = new Drone();
            this.drone.render(this.element);

            this._bindEvents();
        },

        _bindEvents : function _bindEvents(){
            this.drone.bind('drone:returned', this._handleDroneData.bind(this));
        },

        deployDrone : function deployDrone(mapCells){
            this.status = 'deployed';
            this.drone.deploy({
                stationPosition : this.element.position(),
                mapCells : mapCells
            });
        },

        _handleDroneData : function _handleDroneData(ev){
            this.status = 'waiting';

            ev.data.forEach(function(mapCell){
                mapCell.setToProcessing();
            });

            this.dispatch('batch:complete', ev.data);
        }
    }
});