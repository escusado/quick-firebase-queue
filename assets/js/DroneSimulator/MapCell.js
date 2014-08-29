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
            // console.log('>>', this.data);
        },

        takePicture : function takePicture(){
            this.element.addClass('picture-taken');
        }
    }
});