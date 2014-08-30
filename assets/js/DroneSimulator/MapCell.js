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
        },

        setToProcessing : function setToProcessing(){
            this.element.addClass('processing');
            this.element.removeClass('picture-taken');
        },

        reset : function reset(){
            this.element.removeClass('picture-taken');
            this.element.removeClass('processing');

            this.status = 'waiting';
        }
    }
});