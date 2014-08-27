Class('CharacterList').inherits(Widget)({
    ELEMENT_CLASS : 'character-list',

    prototype : {
        _characters : [],

        init : function init(config){
            Widget.prototype.init.call(this, config);
        },

        update : function update(characterData){
            console.log('ttttt:', characterData);
            if(!this._characters[characterData.id]){
                this._characters[characterData.id] = new Character();
                this.element.prepend(this._characters[characterData.id].element);
            }

            this._characters[characterData.id].update(characterData);
        }
    }
});