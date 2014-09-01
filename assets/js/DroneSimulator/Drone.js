Class('Drone').inherits(Widget)({
    ELEMENT_CLASS: 'drone',

    prototype : {

        _targetMapCells : null,
        _gatheredMapCells : null,
        _currentCellMap : null,
        _home : {top: 0, left: 0},
        stationPosition : null,
        _speed : null,
        state: 'waiting',

        init : function(config){
            Widget.prototype.init.call(this, config);
            this._speed = Math.floor(Math.random() * 500) + 100;
            // this._speed = 10;
        },

        deploy : function deploy(config){
            this._currentCellMap = null;
            this._gatheredMapCells = [];

            this._targetMapCells = config.mapCells;
            this._currentCellMap = this._targetMapCells.pop();
            this.stationPosition = {
                top: config.stationPosition.top,
                left: config.stationPosition.left
            };
            this._goToNextPoint();
        },

        _goToNextPoint : function _goToNextPoint(){
            var nextDestination = this._getNextDestination();
            this._flyTo(nextDestination);
        },

        _getNextDestination : function _getNextDestination(){
            if(this._currentCellMap){
                var destination = {
                    top: this._currentCellMap.element.position().top - this.stationPosition.top,
                    left: this._currentCellMap.element.position().left - this.stationPosition.left
                };

                return destination;
            }else{
                return this._home;
            }
        },

        _flyTo : function _flyTo(destination){
            this.element.animate(destination, this._speed, function(ev){
                this._arrivedToDestination();
            }.bind(this));

            var radians = Math.atan2(this.element.position().left - (destination.left), this.element.position().top - (destination.top));
            var degree = (radians * (180 / Math.PI) * -1) + 90;
            this.element.css('-webkit-transform', 'rotate(' + degree + 'deg)');

        },

        _arrivedToDestination : function _arrivedToDestination(){
            //finished
            if(this._targetMapCells.length === 0 && this.state === 'going-home'){
                this.dispatch('drone:returned', {data: this._gatheredMapCells});
                this.state = 'waiting';
                return;
            }

            this._currentCellMap.takePicture();

            //set next destination
            this._gatheredMapCells.push(this._currentCellMap);

            if(this._targetMapCells.length === 0){
                this.state = 'going-home';
                this._currentCellMap = null;
            }else{
                this._currentCellMap = this._targetMapCells.pop();
            }

            this._goToNextPoint();
        }

    }
});