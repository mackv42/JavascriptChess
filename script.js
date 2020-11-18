var canvas = document.getElementById("ChessBoard");
var context = canvas.getContext("2d");

function Clear(board){

}

function RenderBoard(board){
	//Clear(board);

	//render browm and white squares

	//render chess pieces
}




//List of moves made
var PastMoves = [];


function Check(){

}

const Pieces =  {
	"King": {
		"Moves": [{"x": 1, y:1}, {"x": -1, "y":-1}, {"x": 1, "y": -1}, {"x": -1, "y": 1}, {"x": 0, "y": 1}, {"x": 1, "y": 0}, {"x": 0, "y": -1}, {"x": -1, "y": 0}],
		"Amount": 0
	},
	"Queen": {
		"Moves": [{"x": 1, "y":1}, {"x": -1, "y":-1}, {"x": 1, "y": -1}, {"x": -1, "y": 1}, {"x": 0, "y": 1}, {"x": 1, "y": 0}, {"x": 0, "y": -1}, {"x": -1, "y": 0}],
		"Amount": 1
	},
	"Bishop": {
		"Moves": [{"x": 1, "y":1}, {"x": -1, "y":-1}, {"x": 1, "y": -1}, {"x": -1, "y": 1}],
		"Amount": 1
	},
	"Knight": {
		"Moves": [{"x": 2, "y": 1}, {"x": -2, "y": 1}, {"x": 2, "y": -1}, {"x": -2, "y": -1}, {"x": 1, "y": 2}, {"x": 1, "y": -2}, {"x": -1, "y": 2}, {"x": -1, "y": -2}],
		"Amount": 0
	},
	"Rook": {
		"Moves": [{"x": 0, "y": 1}, {"x": 1, "y": 0}, {"x": 0, "y": -1}, {"x": -1, "y": 0}],
		"Amount": 1
	}, 
	"Pawn": {
		"Moves": [{"x": 0, "y": 1}, {"x": 1, "y": 1}, {"x": -1, "y": 1}],
		"Amount": 0
	}
}

const PieceNames = {
	"Ki": Pieces.King,
	"Qu": Pieces.Queen,
	"Bi": Pieces.Bisop,
	"Kn": Pieces.Knight,
	"Ro": Pieces.Rook,
	"Pa": Pieces.Pawn,
	"Na": null
}

const startingBoard = {
	"white": [{"name": "Ro", "x": 0, "y": 0}, {"name":"Kn", "x": 1, "y": 0}, {"name":"Bi", "x": 2, "y": 0}, {"name":"Qu", "x": 3, "y": 0}, {"name":"Ki", "x": 4, "y": 0}, {"name":"Bi", "x": 5, "y": 0}, {"name":"Kn", "x": 6, "y": 0}, {"name":"Ro", "x": 7, "y": 0},
		   {"name":"Pa", "x": 0, "y": 1}, {"name":"Pa", "x": 1, "y": 1}, {"name":"Pa", "x": 2, "y": 1}, {"name":"Pa", "x": 3, "y": 1}, {"name":"Pa", "x": 4, "y": 1}, {"name":"Pa", "x": 5, "y": 1}, {"name":"Pa", "x": 6, "y": 1}, {"name":"Pa", "x": 7, "y": 1}],

	"black": [{"name":"Ro", "x": 0, "y": 7}, {"name":"Kn", "x": 1, "y": 7}, {"name":"Bi", "x": 2, "y": 7}, {"name":"Qu", "x": 3, "y": 7}, {"name":"Ki", "x": 4, "y": 7}, {"name":"Bi", "x": 5, "y": 7}, {"name":"Kn", "x": 6, "y": 7}, {"name":"Ro", "x": 7, "y": 7},
		   {"name":"Pa", "x": 0, "y": 6}, {"name":"Pa", "x": 1, "y": 6}, {"name":"Pa", "x": 2, "y": 6}, {"name":"Pa", "x": 3, "y": 6}, {"name":"Pa", x: 4, "y": 6}, {"name":"Pa", "x": 5, "y": 6}, {"name":"Pa", "x": 6, "y": 6}, {"name":"Pa", "x": 7, "y": 6}]
}


var Move = function(p1, p2){
	this.p1 = p1;
	this.p2 = p2;
	this.difference.x = p2.x - p1.x;
	this.difference.y = p2.y - p2.y;
}


function getPiece(px, py){
	let piece = startingBoard.white.filter( x => x.x == px && x.y == py)[0];
	if(piece === undefined){
		piece = startingBoard.black.filter( x => x.x == px && x.y == py)[0];
	}
	return piece;
}

function Possible(board, move){
	let SelectedPiece = getPiece(move.p1.x, move.p1.y);
	if(SelectedPiece !== null){ return true;}
	//can this piece do that?

	//are you in check after a move? false
	return false;
}

function MakeMove(){
// if(!Possible()){ return board; }
}