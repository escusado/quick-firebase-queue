Class('App').inherits(Widget)({
    prototype : {
        init : function(config){
            Widget.prototype.init.call(this, config);
            this.element.css('min-height',$(window).height());

            this.droneSimulator = new DroneSimulator();
            this.droneSimulator.render(this.element);

            this.firebaseQueueMonitor = new FirebaseQueueMonitor();
            this.firebaseQueueMonitor.render(this.element);

            this._bindEvents();

            Elastic.refresh();
            return;
        },

        _bindEvents : function(){
            this.socket.on('job:error', this.droneSimulator.mapCellFailed.bind(this.droneSimulator));
            this.socket.on('firebq:stats', this.firebaseQueueMonitor.update.bind(this.firebaseQueueMonitor));
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
