Class('CharacterList').inherits(Widget)({
    ELEMENT_CLASS : 'character-list',

    prototype : {
        _characters : [],

        init : function init(config){
            Widget.prototype.init.call(this, config);
        },

        update : function update(characterData){
            if(!this._characters[characterData.id]){
                this._characters[characterData.id] = new Character();
                this._characters[characterData.id].render(this.element);
                console.log('>>>>>', this._characters[characterData.id]);
            }

            this._characters[characterData.id].update(characterData);
        }
    }
});