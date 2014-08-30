Class('Drone').inherits(Widget)({
    ELEMENT_CLASS: 'drone',

    prototype : {

        _targetMapCells : null,
        _gatheredMapCells : null,
        _currentCellMap : null,
        _home : {top: 0, left: 0},
        _stationPosition : null,
        _speed : null,
        state: 'waiting',

        init : function(config){
            Widget.prototype.init.call(this, config);
            this._speed = Math.floor(Math.random() * 500) + 100;
            this._speed = 500;
        },

        deploy : function deploy(targetMapCells){
            this._currentCellMap = null;
            this._gatheredMapCells = [];

            this._targetMapCells = targetMapCells;
            this._currentCellMap = this._targetMapCells.pop();
            this._stationPosition = {
                top: $('.drone-station').first().position().top  - this._currentCellMap.element.height(),
                left: $('.drone-station').first().position().left
            };
            console.log('>>>', this._stationPosition);
            this._goToNextPoint();
        },

        _goToNextPoint : function _goToNextPoint(){
            var nextDestination = this._getNextDestination();
            this._flyTo(nextDestination);
        },

        _getNextDestination : function _getNextDestination(){
            if(this._currentCellMap){
                var destination = {
                    top: this._currentCellMap.element.position().top + this._stationPosition.top,
                    left: this._currentCellMap.element.position().left - this._stationPosition.left
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
        },

        _arrivedToDestination : function _arrivedToDestination(){
            //finished
            if(this._targetMapCells.length === 0 && this.state === 'going-home'){
                this.dispatch('drone:returned', this._gatheredMapCells);
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





        // _goToNextPoint : function _goToNextPoint(){
        //     debugger
        //     var nextDestination;

        //     if(this._currentCellMap){
        //         this._previousCellMap = this._currentCellMap;
        //     }

        //     if(this._targetMapCells.length === 0){
        //         nextDestination = this._finalDestination;
        //     }else{
        //         this._currentCellMap = this._targetMapCells.pop();
        //         nextDestination = this._currentCellMap.element.position();
        //         nextDestination.left = nextDestination.left + ((this._currentCellMap.element.width() - this.element.width())/2);
        //     }

        //     if(
        //         this._targetMapCells.length === 0 &&
        //         this.element.position().top === this._finalDestination.top &&
        //         this.element.position().left === this._finalDestination.left
        //       ){
        //         this.dispatch('drone:returned', this._savedPictures);
        //         this._previousCellMap.takePicture();
        //         this._currentCellMap = null;
        //         this._previousCellMap = null;
        //         return;
        //     }

        //     if(this._previousCellMap){
        //         this._previousCellMap.takePicture();
        //     }

        //     this.element.animate(nextDestination, 100, this._goToNextPoint.bind(this));

        // }