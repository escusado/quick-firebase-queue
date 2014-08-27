var uuid = require('uuid-v4');

Class('CharacterCreator').includes(CustomEventSupport)({
    prototype : {
        _characters : {},

        init : function init(config){

            Object.keys(config || {}).forEach(function (property) {
                this[property] = config[property];
            }, this);

            return true;
        },

        create : function create(characterType){
            this.dispatch('character:data', {
                id: uuid(),
                class : 'warrior'
            });
        }
    }
});

module.exports = new CharacterCreator();