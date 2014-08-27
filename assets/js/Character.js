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

        },

        update : function(characterData){
            var content = '';

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
            this.dataContainerEl.html(this._imageTmpl+content);
        },

        createDataColumnMarkup : function createDataColumnMarkup(colName, contents){
            var container = '<div class="column data '+colName+'">';
            Object.keys(contents).forEach(function(key){
                var value = contents[key];
                container += '<div class="'+key+' '+((value === 'null') ? 'null' : '')+'"><span>'+key+': </span>'+value+'</div>';

            }, this);
            container += '</div>';

            return container;
        }
    }
});