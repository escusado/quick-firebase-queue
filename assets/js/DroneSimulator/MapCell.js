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

            // {
            //     id: '',
            //     status: 'processing',
            //     data : {
            //         coords : {
            //             x: 0,
            //             y: 0
            //         },
            //         layers : [
            //             '/assets/img/maps/sat.png'
            //         ]
            //     }
            // }

        },

        updateUi : function updateUi(){
            var backgrounds;

            this.element.attr('status', this.status);

            backgrounds = this.data.layers.map(function(background){
                var x = this.element.width() * this.data.coords.x,
                    y = this.element.height() * this.data.coords.y;

                console.log('this.element.width(): ', this.element.width());
                console.log('this.data.coords.x: ', this.data.coords.x);
                console.log('this.element.height(): ', this.element.height());
                console.log('this.data.coords.y: ', this.data.coords.y);

                return background.replace('0 0', x+' '+y);
            }.bind(this));

            console.log('>>', backgrounds);

            this.element.css('background', backgrounds.join(','));
        }
    }
});