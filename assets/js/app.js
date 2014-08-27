Class('App').inherits(Widget)({
    prototype : {
        init : function init(config){
            Widget.prototype.init.call(this, config);

            this.newCharEl = this.element.find('.new-character');

            this.charactersList = new CharacterList();
            this.charactersList.render(this.element.find('.characters-list-wrapper'));

            this._bindEvents();
        },

        _bindEvents : function _bindEvents(){
            this.newCharEl.bind('click', this._requestNewCharacter.bind(this));

            this.socket.on('character:data', this._handleCharacterData.bind(this));
        },

        _requestNewCharacter : function _requestNewCharacter(ev){
            this.socket.emit('new:character', ev.target.dataset);
        },

        _handleCharacterData : function _handleCharacterData(ev){
            console.log('>>>', ev);
            ev.data.id = ev.id;
            this.charactersList.update(ev.data);
        }
    }
});

$(document).ready(function(){
    var socket = io.connect();
    window.app = new App({
        element: $('.wrapper'),
        socket : socket
    });
});
