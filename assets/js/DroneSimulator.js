Class('DroneSimulator').inherits(Widget)({
    ELEMENT_CLASS : 'drone-simulator column',
    HTML: '<div>\
        <div class="controls">\
            <a href="javascript:void(0);" class="launch">Launch</a>\
        </div>\
        <div class="maps">\
            <div class="base"></div>\
            <div class="data"></div>\
        </div>\
    </div>',

    prototype : {
        init : function(config){
            Widget.prototype.init.call(this, config);

            this.baseMapEl = this.element.find('.base');
            this.dataMapEl = this.element.find('.data');
        }
    }
});