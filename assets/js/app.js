Class('App').inherits(Widget)({
    prototype : {
        init : function(config){
            Widget.prototype.init.call(this, config);


            this.droneSimulator = new DroneSimulator();
            this.droneSimulator.render(this.element);

            this._bindEvents();

            return;
        },

        _bindEvents : function(){
            this.socket.on('job:error', this.droneSimulator.mapCellFailed.bind(this));
        },

        _handleEcho : function(data){
            console.log(data.message);
        }
    }
});

$(document).ready(function(){
    var socket = io.connect();
    window.app = new App({
        element : $('.wrapper'),
        socket : socket
    });
});
