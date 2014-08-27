Class('Character').inherits(Widget)({
    ELEMENT_CLASS: 'character',
    HTML : '<div>\
        <div class="unit columns on-3">\
            <div class="column portrait">\
                <img class="portrait" src="http://toily.mx/files/hero-0.png" alt="" />\
            </div>\
            <div class="column data">\
                <div class="type"><span class="label">Type:</span>Hero</div>\
                <div class="name"><span class="label">Name:</span>Reginald</div>\
                <div class="age"><span class="label">Age:</span>25</div>\
                <div class="class"><span class="label">Class:</span>Warrior</div>\
            </div>\
            <div class="column stats">\
                <div class="hp"><span class="label">Hp:</span>100</div>\
                <div class="str"><span class="label">Str:</span>100</div>\
                <div class="int"><span class="label">Int:</span>50</div>\
                <div class="agi"><span class="label">Agi:</span>20</div>\
            </div>\
        </div>\
    </div>',

    prototype : {
        init : function(config){
            Widget.prototype.init.call(this, config);

            this.portraitEl = this.element.find('img.portrait');
            this.typeEl     = this.element.find('.type');
            this.nameEl     = this.element.find('.name');
            this.ageEl      = this.element.find('.age');
            this.classEl    = this.element.find('.class');
        },

        update : function(characterData){
            Object.keys(characterData).forEach(function(key){
                var value = characterData[key];
                this[key+'El'].html(value);
            }, this);
        }
    }
});