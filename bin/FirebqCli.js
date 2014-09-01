var net = require('net'),
    socket = new net.Socket();

Class('FirebqCli').includes(CustomEventSupport)({
    prototype : {
        init : function init(config){

            Object.keys(config || {}).forEach(function (property) {
                this[property] = config[property];
            }, this);

            socket.on('error', function(){
                console.log('Error firebq server not present in port: ' + 8888);
            });

            socket.on('connect', function(){
                socket.setEncoding('utf-8');
            });

            socket.on('data', this._handleSocketData.bind(this));

            socket.connect(8888, 'localhost');

            return true;
        },

        enque : function enque(job){
            console.log('enqueuing', job);
            socket.write('enque:job|'+job+'\n');
        },

        _handleSocketData : function _handleSocketData(data){
            var jobStatus = data.split('|')[0],
                job = data.split('|')[1];

            switch (jobStatus) {
                case 'job:done':
                    this.dispatch('job:done', {data: job});
                    break;
                case 'job:error':
                    this.dispatch('job:error', {data: job});
                    break;
                default:
                    break;
            }
        }
    }
});