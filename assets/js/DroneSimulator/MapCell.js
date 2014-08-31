Class('MapCell').inherits(Widget)({
    ELEMENT_CLASS: 'map-cell',
    prototype : {

        data: {
            layers: null,
            size : null,
            coords: {
                x: null,
                y: null
            }
        },

        status : 'waiting', // 'taken',

        init : function init(config){
            Widget.prototype.init.call(this, config);
        },

        takePicture : function takePicture(){
            this.status = 'picture-taken';
            this.updateUi();
        },

        setToProcessing : function setToProcessing(){
            this.status = 'processing';
            this.updateUi();
        },

        reset : function reset(){
            this.status = 'waiting';

            this.data = {
                layers: null,
                size : null,
                coords: {
                    x: null,
                    y: null
                }
            };

            this.updateUi();
        },

        updateData : function updateData(data){
            this.data = data;
            this.updateUi();
        },

        updateUi : function updateUi(){
            var backgrounds;

            this.element.attr('status', this.status);

            //build background image css value
            if(this.data.layers && this.data.layers.length > 0){

                backgrounds = this.data.layers.map(function(background){
                    var x = this.element.width() * this.data.coords.x,
                        y = this.element.height() * this.data.coords.y;
                    return background.replace('{pos}', '-'+x+'px -'+y+'px');
                }.bind(this));

                this.element.css('background', backgrounds.join(','));
            }

        }
    }
});