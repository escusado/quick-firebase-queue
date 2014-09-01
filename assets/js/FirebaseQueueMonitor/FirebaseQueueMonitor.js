Class('FirebaseQueueMonitor').inherits(Widget)({
    ELEMENT_CLASS : 'column firebase-queue-monitor',
    prototype : {
        init : function(config){
            Widget.prototype.init.call(this, config);

            this.firebaseQueueStorageRef = new Firebase("https://toily-firebq-storage.firebaseio.com/");

            this._bindEvents();
        },

        _bindEvents : function _bindEvents(){
            this.firebaseQueueStorageRef.on('value', this._handleQueueUpdate.bind(this));
        },

        _handleQueueUpdate : function _handleQueueUpdate(snapshot){
            console.log('Workers', snapshot.val());
        }
    }
});