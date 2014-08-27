var net = require('net');

require('neon');

Class('Borium')({

    config : function(config){
        this.config = config;
        return this;
    },

    get : function(type, callback){
        this._request('get:' + type + ':', callback);
    },

    put : function(type, job, callback){
        this._request(type + '|' + job, callback);
    },

    _request : function(query, callback){
        var borCli = this,
            counter = 0,
            data = '',
            socket = new net.Socket();

        socket.on('error', function(){
            console.log('Error Borium not present in port: ' + borCli.config.port);
        });

        socket.on('connect', function(){
            socket.write(query);
            socket.end();
        });

        socket.on('data', function(chunk){
            var jsonData = {status:'unknown'};

            //Sometimes chunk is undefined so I need to try-catch it
            try {
                jsonData = JSON.parse(chunk.toString());
            } catch(err) {
                console.log(err);
            }
            callback(jsonData);
        });

        socket.connect(borCli.config.port, 'localhost');
    }
});

exports.Borium = Borium;