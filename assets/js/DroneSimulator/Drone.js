Class('Drone').inherits(Widget)({
    ELEMENT_CLASS: 'drone',

    prototype : {

        _targetMapCells : [],
        _savedPictures : ['here', 'be', 'data'],
        _finalDestination : {top: 0, left: 0},
        _currentCellMap : null,
        _previousCellMap: null,

        init : function(config){
            Widget.prototype.init.call(this, config);
        },

        deploy : function deploy(targetPoints){
            this._targetMapCells = this._targetMapCells.concat(targetPoints);
            this._goToNextPoint();
        },

        _goToNextPoint : function _goToNextPoint(){
            var nextDestination;

            if(this._currentCellMap){
                this._previousCellMap = this._currentCellMap;
            }

            if(this._targetMapCells.length === 0){
                nextDestination = this._finalDestination;
            }else{
                this._currentCellMap = this._targetMapCells.pop();
                nextDestination = this._currentCellMap.element.position();
                nextDestination.left = nextDestination.left + ((this._currentCellMap.element.width() - this.element.width())/2);
            }

            if(
                this._targetMapCells.length === 0 &&
                this.element.position().top === this._finalDestination.top &&
                this.element.position().left === this._finalDestination.left
              ){
                this.dispatch('drone:returned', this._savedPictures);
                return;
            }

            if(this._previousCellMap){
                this._previousCellMap.takePicture();
                this._previousCellMap = null;
            }

            this.element.animate(nextDestination, 100, this._goToNextPoint.bind(this));

        }
    }
});