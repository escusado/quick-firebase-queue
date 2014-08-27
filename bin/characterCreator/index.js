var uuid = require('uuid-v4'),
    fs   = require('fs'),
    Firebase = require("firebase"),
    myFirebaseRef = new Firebase("https://charcreator.firebaseio.com/"),
    boriumConf = JSON.parse(fs.readFileSync(__dirname+'/../borium-conf.json')),
    firebqClient = require('./vendor/BoriumClient.js').Borium.config(boriumConf);

Class('CharacterCreator').includes(CustomEventSupport)({
    prototype : {
        _characterTypes : {},
        _charactersStorage : {},

        init : function init(config){

            Object.keys(config || {}).forEach(function (property) {
                this[property] = config[property];
            }, this);

            this._addCharacterType({
                jobs : ['addName', 'addAge', 'addStats'],

                data : {
                    id: null,
                    meta:{
                        charType: 'hero',
                        name: 'Reginald',
                        class : null,
                        age: null
                    },
                    portrait : null,
                    stats:{
                        hp: 50,
                        mp: 10,
                        str: 50,
                        agi: 60
                    }
                }
            });


            this._addCharacterType({
                jobs : ['addName', 'addStats'],

                data : {
                    id: null,
                    meta:{
                        charType: 'enemy',
                        class : 'warrior'
                    },
                    portrait : null,
                    stats:{
                        hp: 50,
                        str: 50
                    }
                }
            });

            this._bindEvents();

            return true;
        },

        _addCharacterType : function _addCharacterType(character){
            this._characterTypes[character.data.meta.charType] = character;
        },

        create : function create(character){
            console.log('=====');
            var charData = this._characterTypes[character.type].extend({});

            charData.id = uuid();
            charData.status = 'waiting';

            this._charactersStorage[charData.id] = charData;

            myFirebaseRef.set(this._charactersStorage);
        },

        _bindEvents : function _bindEvents(){
            myFirebaseRef.on('value', this._checkForPendingCharacters.bind(this));
            myFirebaseRef.on('child_changed', this._notifyUpdate.bind(this));
        },

        _checkForPendingCharacters : function _checkForPendingCharacters(snapshot){

            if(snapshot.val()){
                this._charactersStorage = snapshot.val();

                //get pending chars
                Object.keys(this._charactersStorage).forEach(function(key){
                    var charData = this._charactersStorage[key];
                    // console.log('====', charData);
                    if(charData.status === 'waiting'){
                        firebqClient.put(charData.jobs[0], JSON.stringify(charData));
                    }
                }, this);

            }
        },

        _notifyUpdate : function _notifyUpdate(snapshot){
            // console.log('>>>>', snapshot.val());
            this.dispatch('character:data', snapshot.val());
        }
    }
});

module.exports = new CharacterCreator();