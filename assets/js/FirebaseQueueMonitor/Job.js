Class('Job').inherits(Widget)({
    ELEMENT_CLASS: 'job',
    HTML: '<div status="">\
        <span class="status"></span><span class="job-command"></span>\
    </div>',

    prototype : {
        init : function(config){
            Widget.prototype.init.call(this, config);

            this.statusEl = this.element.find('.status');
            this.jobCommandEl = this.element.find('.job-command');

            this.jobCommandEl.html(this.data.job);

            this.updateUi();
        },

        update : function update(stat){
            this.data.status = stat.data.status;
            this.updateUi();
        },

        updateUi : function updateUi(){
            this.element.attr('status', this.data.status);
            this.statusEl.html(this.data.status);
        }
    }
});