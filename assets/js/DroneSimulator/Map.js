Class('Map').inherits(Widget)({
    ELEMENT_CLASS: 'map',
    HTML : '<div> <div class="map-cells"></div> </div>',
    prototype : {

        _mapSize: {w: 520, h: 290},
        _horizontalCellQuantity: 10,
        _mapCells: {},
        _mapCellsModel: {},
        _returnRandomOrderedCells : true,

        myFirebaseRef: null,

        init : function init(config){
            Widget.prototype.init.call(this, config);

            this._mapCellsEl = this.element.find('.map-cells');
            this.myFirebaseRef = new Firebase("https://toily-map-data.firebaseio.com/");
            this.myFirebaseRef.set({}); //CleanDb

            this._writeMapStyles();

            this._createCellMap();

            this._bindEvents();
        },

        _bindEvents : function _bindEvents(){
            this.myFirebaseRef.on('child_changed', this._handleMapDataUpdate.bind(this));
        },

        _createCellMap : function _createCellMap(){
            var row, col, cellId, newCell, newCellRecord,
                neededCells = {
                    hor: Math.floor(this._mapSize.w/this._cellSize),
                    ver: Math.floor(this._mapSize.h/this._cellSize)+1
                };

            for(row=0; row<neededCells.ver; row+=1){
                for(col=0; col<neededCells.hor; col+=1){
                    cellId = guid();
                    newCellRecord = {
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
                    };
                    this._mapCellsModel[cellId] = newCellRecord;
                    newCell = this._mapCells[cellId] = new MapCell();
                    newCell.render(this._mapCellsEl);
                }
            }

            //persist db
            this.myFirebaseRef.set(this._mapCellsModel);
        },

        _writeMapStyles : function _writeMapStyles(){
            var bestMapSize = 0,
                bestHorizontalCellQuantity = 0;

            this._cellSize = Math.ceil(this._mapSize.w / this._horizontalCellQuantity);

            //re evaluate cell quty becasue of size issues
            while(bestMapSize < this._mapSize.w){
                bestHorizontalCellQuantity+=1;
                bestMapSize = bestHorizontalCellQuantity * this._cellSize;
            }

            this._horizontalCellQuantity = bestHorizontalCellQuantity;
            this._mapSize.w = bestMapSize;

            this.element.append('<style> .map-cells{ width: '+bestMapSize+'px } .map{ width: '+this._mapSize.w+'px; height: '+this._mapSize.h+'px } .map-cell{ width: '+this._cellSize+'px; height: '+this._cellSize+'px }</style>')
        },

        getPendingCellMaps : function getPendingCellMaps(picturesQuantity){
            var addLocked = false,
                batchForStation = [],
                keyList = [];

            keyList = this._returnRandomOrderedCells ? Util.shuffleArray(Object.keys(this._mapCells)) : Object.keys(this._mapCells);

            keyList.forEach(function(cellId){
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
        },

        _handleMapDataUpdate : function _handleMapDataUpdate(snapshot){
            //update local model
            var updatedRecord = snapshot.val();

            this._mapCellsModel[updatedRecord.id] = updatedRecord;
            this._mapCells[updatedRecord.id].updateData(updatedRecord.data);
        }
    }
});

