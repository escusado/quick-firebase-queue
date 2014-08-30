Class('Map').inherits(Widget)({
    ELEMENT_CLASS: 'map',
    HTML : '<div> <div class="map-cells"></div> </div>',
    prototype : {

        _mapSize: {w: 520, h: 290},
        _horizontalCellQuantity: 50,
        _mapCells: {},
        myFirebaseRef: null,

        init : function init(config){
            Widget.prototype.init.call(this, config);

            this._mapCellsEl = this.element.find('.map-cells');

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
                    newCell.render(this._mapCellsEl);
                }
            }
        },

        _writeMapStyles : function _writeMapStyles(){
            var mapSizeW = 0,
                bestHorizontalCellQuantity = 0;

            this._cellSize = Math.ceil(this._mapSize.w / this._horizontalCellQuantity);

            //re evaluate cell quty becasue of size issues
            while(mapSizeW < this._mapSize.w){
                bestHorizontalCellQuantity+=1;
                mapSizeW = bestHorizontalCellQuantity * this._cellSize;
            console.log('>', mapSize);
            }

            mapSize = (bestHorizontalCellQuantity+1) * this._cellSize;
            this._horizontalCellQuantity = bestHorizontalCellQuantity+1;

            this.element.append('<style> .map-cells{ width: '+mapSize+'px } .map{ width: '+this._mapSize.w+'px; height: '+this._mapSize.h+'px } .map-cell{ width: '+this._cellSize+'px; height: '+this._cellSize+'px }</style>')
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

            if(batchForStation.length === 0){
                batchForStation = null;
            }

            return batchForStation;
        },

        reset : function reset(){
            Object.keys(this._mapCells).forEach(function(cellId){
                var mapCell = this._mapCells[cellId];
                mapCell.reset();
            }, this);
        }
    }
});