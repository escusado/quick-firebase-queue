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
            var targetMapCells = [];

            this.status = 'deployed';

            mapCells.forEach(function(mapCell){
                 targetMapCells.push(mapCell);
            });

            this.drone.deploy(targetMapCells);
        },

        _handleDroneData : function _handleDroneData(ev){
            this.status = 'waiting';
            this.dispatch('batch:complete');
        }
    }
});