Class('Worker').inherits(Widget)({
    ELEMENT_CLASS: 'worker',

    prototype : {
        init : function(config){
            Widget.prototype.init.call(this, config);

            this.element.html(this.id);
        }
    }
});