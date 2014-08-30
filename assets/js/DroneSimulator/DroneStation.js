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
            this.drone.deploy(mapCells);
        },

        _handleDroneData : function _handleDroneData(ev){
            this.status = 'waiting';
            this.dispatch('batch:complete', ev.data);
        }
    }
});