var socket,
    net = require('net');

Class('FirebqCli').includes(CustomEventSupport)({
    prototype : {

        _socketBuffer : '',

        _commands : [],
        _isServerConnected : false,

        init : function init(config){

            Object.keys(config || {}).forEach(function (property) {
                this[property] = config[property];
            }, this);

            this._connectSocket();

            return true;
        },

        _connectSocket : function _connectSocket(){
            socket = new net.Socket();

            socket.on('error', function(){
                console.log('Error firebq server not present in port: ' + 8888);
                console.log('Reconnect attempt...');
                this._isServerConnected = false;
                setTimeout(function(){
                    this._connectSocket();
                }.bind(this), 1000);
            }.bind(this));

            socket.on('connect', function(){
                socket.setEncoding('utf-8');
                console.log('Firebq Cli connected');
                this._isServerConnected = true;
                this._sendCommands();
            }.bind(this));

            socket.on('data', this._handleSocketData.bind(this));

            socket.connect(8888, 'localhost');
        },

        enque : function enque(job){
            this._commands.push(job);
            this._sendCommands();
        },

        _sendCommands : function _sendCommands(){
            if(this._isServerConnected){
                while(this._commands.length > 0){
                    socket.write('enqueue:job|'+this._commands.pop()+'\n');
                }
            }
        },

        _handleSocketData : function _handleSocketData(data){
            this._socketBuffer += data;

            while(this._socketBuffer.length){
                var bufferedCommand = this._socketBuffer.split('\n')[0];

                var jobStatus = bufferedCommand.split('|')[0],
                    job = bufferedCommand.split('|')[1];

                switch (jobStatus) {
                    case 'job:done':
                        this.dispatch('job:done', {data: job});
                        break;
                    case 'job:error':
                        this.dispatch('job:error', {data: job});
                        break;
                    case 'firebq:stats':
                        this.dispatch('firebq:stats', {data: job});
                        break;
                    default:
                        break;
                }

                //remove command from buffer and continue
                this._socketBuffer = this._socketBuffer.replace(bufferedCommand+'\n', '');
            }
        }
    }
});
