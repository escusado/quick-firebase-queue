//Firebase based Borium implementation
var net = require('net');

Class('FirebqServer')({


    config : function config(config){
        this.config = config;
        return this;
    },

    get : function get(type, callback){
        this._request('get:' + type + ':', callback);
    },

    put : function put(type, job, callback){
        this._request('put:' + type + ':' + job, callback);
    },

    start : function start(query, callback){
        var firebqServer = this,
            counter = 0,
            data = '',
            server = net.createServer();

        server.listen(firebqServer.config.port, 'localhost');

        server.on('connection', function(socket) {
            socket.setEncoding('utf-8');

            socket.on('data', this._handleIncomigJob.bind(this));

        });
    },

    _handleIncomigJob : function _handleIncomigJob(job){
        job
    }
});

exports.FirebqServer = FirebqServer;