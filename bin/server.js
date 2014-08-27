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
    fs      = require('fs'),

    characterCreatorInstance = require('./characterCreator');

require('./firebq');

//Application
Class('Server')({
    prototype : {
        init : function init(){
            this._configureApp();
            this._setRoutes();
            this._bindEvents();
            this._setupSockets();
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

        _setupSockets : function _setupSockets(){
            var server = this;

            io.sockets.on('connection', function (socket) {
                socket.on('new:character', server._createNewCharacter.bind(this, socket));
            });
        },

        _bindEvents : function _bindEvents(){
            characterCreatorInstance.bind('character:data', function(characterData){
                io.sockets.emit('character:data', characterData);
            });
        },

        _createNewCharacter : function _createNewCharacter(socket, data){
            characterCreatorInstance.create(data);
        },

        _serverStart : function _serverStart(){
            console.log('Server ready');
            console.log('http://localhost:'+serverPort.toString());
            server.listen(serverPort);
        }
    }
});

Object.defineProperty(Object.prototype, "extend", {
    enumerable: false,
    value: function(from) {
        var props = Object.getOwnPropertyNames(from);
        var dest = this;
        props.forEach(function(name) {
            if (name in dest) {
                var destination = Object.getOwnPropertyDescriptor(from, name);
                Object.defineProperty(dest, name, destination);
            }
        });
        return this;
    }
});

//Startup
var server = new Server();
