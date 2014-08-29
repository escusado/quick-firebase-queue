Class('Map').inherits(Widget)({
    ELEMENT_CLASS: 'map',
    prototype : {

        _mapSize: {w: 520, h: 290},
        _horizontalCellQuantity: 13,
        _mapCells: {},
        myFirebaseRef: null,

        init : function init(config){
            Widget.prototype.init.call(this, config);

            this._writeMapStyles();

            // this.myFirebaseRef = new Firebase("https://toily-map-data.firebaseio.com/");

            this._createCellMap();
        },

        _createCellMap : function _createCellMap(){
            var row, col, cellId, newCell
                neededCells = {
                    hor: Math.floor(this._mapSize.w/this._cellSize),
                    ver: Math.floor(this._mapSize.h/this._cellSize)
                };

            for(row=0; row<neededCells.ver; row+=1){
                for(col=0; col<neededCells.hor; col+=1){

                    cellId = guid();
                    newCell = this._mapCells[cellId] = new MapCell({
                        id: cellId,
                        status : 'waiting',
                        data: {
                            layers: [],
                            size: this._cellSize,
                            coords: {
                                x: row,
                                y: col
                            }
                        },
                    });
                    newCell.render(this.element);
                }
            }
        },

        _writeMapStyles : function _writeMapStyles(){
            this._cellSize = Math.floor(this._mapSize.w / this._horizontalCellQuantity);
            this.element.append('<style>.map{ width: '+this._mapSize.w+'px; height: '+this._mapSize.h+'px } .map-cell{ width: '+this._cellSize+'px; height: '+this._cellSize+'px }</style>')
        },

        getPendingCellMaps : function getPendingCellMaps(picturesQuantity){
            var addLocked = false,
                batchForStation = [];

            Object.keys(this._mapCells).forEach(function(cellId){
                var mapCell = this._mapCells[cellId];
                if(mapCell.status === 'waiting' && batchForStation.length < picturesQuantity){
                    mapCell.status = 'taken';
                    batchForStation.push(mapCell);
                }
            }, this);

            return batchForStation;
        }
    }
});