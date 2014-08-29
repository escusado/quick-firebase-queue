Class('App').inherits(Widget)({
    prototype : {
        init : function(config){
            Widget.prototype.init.call(this, config);

            this._bindEvents();

            // console.log('Send socket req...');
            // this.socket.emit('client:hello', {
            //     message: 'sup!'
            // });

            this.droneSimulator = new DroneSimulator();
            this.droneSimulator.render(this.element);

            return;
        },

        _bindEvents : function(){
            this.socket.on('server:echo', this._handleEcho.bind(this));
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
