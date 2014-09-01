#! /usr/local/bin/node

require('neon');
require('neon/stdlib');

//Config
var serverPort = 3000;

//Dependencies
var express = require('express'),
    http    = require('http'),
    app     = express(),
    server  = http.createServer(app),
    io      = require('socket.io').listen(server),
    fs      = require('fs');

//app stack
require('./DroneDataProcessor.js');
var droneDataProcessor = new DroneDataProcessor();

//Application
Class('Server')({
    prototype : {
        init : function (){
            this._configureApp();
            this._setRoutes();
            this._bindEvents();
            this._serverStart();


            return this;
        },

        _configureApp : function _configureApp(){
            //neon
            app.use('/neon', express.static('node_modules/neon'));

            //CORS
            app.use(function (req, res, next) {
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Headers", "X-Requested-With");
                next();
            });

            //Static routes
            app.use('/assets', express.static('assets'));

            return this;
        },

        _setRoutes : function _setRoutes(){
            app.get('/', function(req, res){
                res.sendFile('views/index.html', {'root': __dirname + '/..'});
            });

            return this;
        },

        _bindEvents : function _bindEvents(){
            var server = this;

            //front end drone complete
            io.sockets.on('connection', function (socket) {
                socket.on('batch:complete', server._handleDroneData.bind(this, socket));
            });

            //drone backend app, process failed
            droneDataProcessor.bind('job:error', function(data){
                io.sockets.emit('job:error', data);
            });
        },

        _serverStart : function _serverStart(){
            console.log('Server ready');
            console.log('http://localhost:'+serverPort.toString());
            server.listen(serverPort);
        },

        _handleDroneData : function _handleDroneData(socket, ev){
            ev.data.forEach(function(mapCellId){
                droneDataProcessor.enqueMapCellData(mapCellId);
            }, this);
        }
    }
});

//Startup
var server = new Server();
