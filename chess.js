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
	"Bi": Pieces.Bishop,
	"Kn": Pieces.Knight,
	"Ro": Pieces.Rook,
	"Pa": Pieces.Pawn,
	"Na": null
}

function getPiece(board, px, py){
	let color = "white";
	let piece = board.white.filter( x => x.x == px && x.y == py)[0];
	if(piece === undefined){
		piece = board.black.filter( x => x.x == px && x.y == py)[0];
		color = "black";
	}
	if(piece === undefined){
		return undefined;
	}
	return {"piece": piece, "color": color }
}

function inBounds(x, y){
	if(x>=0 && x<=7 && y>=0 && y<=7){
		return true;
	}

	return false;
}


//modify to tell if move is threating
function possibleMoves(board, pieceInfo){
	let possibilities = [];
	let piece = pieceInfo.piece;
	let pieceType = PieceNames[piece.name];
	
	if(piece.name == "Pa"){
		if(pieceInfo.color == "white"){
			if(getPiece(board, piece.x, piece.y+1) === undefined){ possibilities.push({"x": piece.x, "y": piece.y+1, "noThreat": true}); 
				if(piece.y == 1 && getPiece(board, piece.x, piece.y+2) === undefined){possibilities.push({"x": piece.x, "y": piece.y+2, "noThreat": true});}}
			if(getPiece(board, piece.x+1, piece.y+1) !== undefined){ possibilities.push({"x": piece.x+1, "y": piece.y+1}); }
			if(getPiece(board, piece.x-1, piece.y+1) !== undefined){ possibilities.push({"x": piece.x-1, "y": piece.y+1}); }
		} else if(pieceInfo.color == "black"){
			if(getPiece(board, piece.x, piece.y-1) === undefined){ possibilities.push({"x": piece.x, "y": piece.y-1, "noThreat": true}); 
				if(piece.y == 6 && getPiece(board, piece.x, piece.y-2) === undefined){possibilities.push({"x": piece.x, "y": piece.y-2, "noThreat": true});}}
			if(getPiece(board, piece.x+1, piece.y-1) !== undefined){ possibilities.push({"x": piece.x+1, "y": piece.y-1}); }
			if(getPiece(board, piece.x-1, piece.y-1) !== undefined){ possibilities.push({"x": piece.x-1, "y": piece.y-1}); }
		}
	}

	if(piece.name == "Kn"){
		for(let i=0; i<pieceType.Moves.length; i++){
			let x = piece.x + pieceType.Moves[i].x;
			let y = piece.y + pieceType.Moves[i].y;
			if(!inBounds(x, y)){ continue; }
			possibilities.push({"x": x, "y": y});
		}

	}

	if(piece.name == "Ki"){
		for(let i=0; i<pieceType.Moves.length; i++){
			let x = piece.x+pieceType.Moves[i].x;
			let y = piece.y+pieceType.Moves[i].y;
			if(inBounds(x, y)){ possibilities.push({"x": x, "y": y});}
		}
	}

	if(pieceType.Amount == 1){
		for(let i=0; i<pieceType.Moves.length; i++){
			let x = piece.x;
			let y = piece.y;

			while(inBounds(x, y)){
				x+=pieceType.Moves[i].x;
				y+=pieceType.Moves[i].y;
				if(getPiece(board, x, y) !== undefined){
					possibilities.push({"x": x, "y": y});
					break;
				}
				possibilities.push({"x": x, "y": y});
			}
			
		}
	}

	for(let i=0; i<possibilities.length; i++){
		for(let j=0; j<possibilities.length; j++){
			let currentPiece = getPiece(board, possibilities[j].x, possibilities[j].y);
			if(currentPiece !== undefined && currentPiece.color !== undefined){
				if(getPiece(board, currentPiece.piece.x, currentPiece.piece.y).color == pieceInfo.color){
					possibilities.splice(j, 1);
				}
			}
		}
	}
	return possibilities;
}