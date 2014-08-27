Class('Character').inherits(Widget)({
    ELEMENT_CLASS: 'character',
    HTML : '<div>\
        <div class="unit columns on-3 data-container"></div>\
    </div>',

    prototype : {

        _imageTmpl : '<div class="column fixed portrait"><img src="http://toily.mx/files/spinner.gif" alt="" /></div>',

        init : function(config){
            Widget.prototype.init.call(this, config);

            this.portraitEl = this.element.find('img.portrait');
            this.dataContainerEl = this.element.find('.data-container');
            // this.charTypeEl = this.element.find('.chartype');
            // this.nameEl     = this.element.find('.name');
            // this.ageEl      = this.element.find('.age');
            // this.classEl    = this.element.find('.class');
        },

        update : function(characterData){
            var content = this._imageTmpl;

            Object.keys(characterData).forEach(function(key){
                if(key === 'id'){
                    return;
                }
                if(key === 'portrait'){
                    this._imageTmpl = this._imageTmpl.replace('spinner.gif', characterData['portrait']);
                    return;
                }

                content += this.createDataColumnMarkup(key, characterData[key]);
            }, this);
            this.dataContainerEl.html(content);
        },

        createDataColumnMarkup : function createDataColumnMarkup(colName, contents){
            var container = '<div class="column data '+colName+'">';
            Object.keys(contents).forEach(function(key){
                var value = contents[key];
                container += '<div class="'+key+'"><span>'+key+':</span>'+value+'</div>';

            }, this);
            container += '</div>';

            return container;
        }
    }
});