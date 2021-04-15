const startingBoard = {
	"white": [{"name": "Ro", "x": 0, "y": 0}, {"name":"Kn", "x": 1, "y": 0}, {"name":"Bi", "x": 2, "y": 0}, {"name":"Qu", "x": 4, "y": 0}, {"name":"Ki", "x": 3, "y": 0}, {"name":"Bi", "x": 5, "y": 0}, {"name":"Kn", "x": 6, "y": 0}, {"name":"Ro", "x": 7, "y": 0},
		   {"name":"Pa", "x": 0, "y": 1}, {"name":"Pa", "x": 1, "y": 1}, {"name":"Pa", "x": 2, "y": 1}, {"name":"Pa", "x": 3, "y": 1}, {"name":"Pa", "x": 4, "y": 1}, {"name":"Pa", "x": 5, "y": 1}, {"name":"Pa", "x": 6, "y": 1}, {"name":"Pa", "x": 7, "y": 1}],

	"black": [{"name":"Ro", "x": 0, "y": 7}, {"name":"Kn", "x": 1, "y": 7}, {"name":"Bi", "x": 2, "y": 7}, {"name":"Qu", "x": 4, "y": 7}, {"name":"Ki", "x": 3, "y": 7}, {"name":"Bi", "x": 5, "y": 7}, {"name":"Kn", "x": 6, "y": 7}, {"name":"Ro", "x": 7, "y": 7},
		   {"name":"Pa", "x": 0, "y": 6}, {"name":"Pa", "x": 1, "y": 6}, {"name":"Pa", "x": 2, "y": 6}, {"name":"Pa", "x": 3, "y": 6}, {"name":"Pa", x: 4, "y": 6}, {"name":"Pa", "x": 5, "y": 6}, {"name":"Pa", "x": 6, "y": 6}, {"name":"Pa", "x": 7, "y": 6}],
	"turn": "white",
	"checkMate": ""
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

//tells if white or black is in check
function inCheck(board){
	let blackKing = board.black.filter(x => x.name == "Ki")[0];
	let whiteKing = board.white.filter(x => x.name == "Ki")[0];
	for(let i=0; i<board.white.length; i++){
		let piece = {}
		piece.piece = board.white[i];
		piece.color = "white";
		let moves = possibleMoves(board, piece);

		for(let j=0; j<moves.length; j++){
			if(moves[j].x == blackKing.x && moves[j].y == blackKing.y){
				return "black";
			}
		}
	}

	for(let i=0; i<board.black.length; i++){
		let piece = {}
		piece.piece = board.black[i];
		piece.color = "black";
		let moves = possibleMoves(board, piece);

		for(let j=0; j<moves.length; j++){
			if(moves[j].x == whiteKing.x && moves[j].y == whiteKing.y){
				return "white";
			}
		}
	}


	return undefined;
}

// usage Possible(ChessBoard, Move{x1, y1, x2, y2})
// is a move possible
//    

function Possible(board, move){
	let SelectedPiece = getPiece(board, move.p1.x, move.p1.y);
	if(SelectedPiece === null){ return false; }
	if(move.p2.x > 7 || move.p2.x < 0 || move.p2.y > 7 || move.p2.y < 0){ return false; }
	if(move.p1.x > 7 || move.p1.x < 0 || move.p1.y > 7 || move.p2.y < 0){ return false; }
	
	let PossibleMoves = possibleMoves(board, SelectedPiece);
	//can this piece do that?
	//console.log(PossibleMoves);
	for(let i=0; i<PossibleMoves.length; i++){
		if(PossibleMoves[i].x == move.p2.x && PossibleMoves[i].y == move.p2.y){
			return true;
		}
	}
	//are you in check after a move? false
	return false;
}

//makes a copy for immutability
function copyBoard(board){
	let newBoard = {};
	newBoard["white"] = [];
	newBoard["black"] = [];
	for(let i=0; i<board.white.length; i++){
		newBoard["white"].push({"name": board.white[i].name, "x": board.white[i].x, "y": board.white[i].y});
	}

	for(let i=0; i<board.black.length; i++){
		newBoard["black"].push({"name": board.black[i].name, "x": board.black[i].x, "y": board.black[i].y});
	}

	newBoard.turn = board.turn;
	return newBoard;
}

function staleMate(board){
		//get all possible moves see if they all lead to check 
	let king = board[board.turn].filter(x => x.name == "Ki")[0];
	let piece = {};
	let counter1 = 0;
	let counter2 = 0;

	for(let i=0; i<board[board.turn].length; i++){
		piece = {"piece": board[board.turn][i], "color": board.turn};
		let possibilities = possibleMoves(board, piece);
		for(let j=0; j<possibilities.length; j++){
			if(MakeMove(board, piece.piece.x, piece.piece.y, possibilities[j].x, possibilities[j].y) == undefined){
				counter2++;
			}
			counter1++;
		}
	}

	if(counter1 == counter2 ){
		return board.turn;
	} else{
		return "";
	}
}

function checkMate(board){
	let king = board[board.turn].filter(x => x.name == "Ki")[0];
	let possibilities = [];
	possibilities = possibleMoves(board, {"piece": king, "color": board.turn});
	if(inCheck(board) == board.turn){
		return staleMate(board);
	}
	
	return ""; 
}

//checks if this is a valid chess board
function isValid(board){
	if(board.white.length == 0 || board.black.length|| board === undefined){ return false; }
	for(let i = 0; i< board.white.length; i++){
		for(let j=0; j<board[j].white.length; j++){
			//is valid piece name
			if(pieceNames[board.white[i][j].name] === undefined){
				return false;
			}

			//is valid location
			if(!inBounds(board.white[i][j].x, board.white[i][j].y)){
				return false;
			}
		}
	}

	return true;
}


//list of threatened squares
function getThreats(board){
	let whiteThreats = [];
	let blackThreats = [];

	for( let i =0; i < board.white.length; i++){
		let possibilities = possibleMoves(board, board.white[i].x, board.white[i].y);
		for( let j=0; j< possibilities.length; j++){
			if(possibilites.noThreat !== undefined && 
				whiteThreats.filter(
					(x) => x.x == possibilities[j].x && possibilities[j].y == x.y).length == 0){
				blackThreats.push({"x": possibilities[j].x, "y": possibilities[j].y});
			}
		}
	}

	for( let i =0; i < board.black.length; i++){
		let possibilities = possibleMoves(board, board.black[i].x, board.black[i].y);
		for( let j=0; j< possibilities.length; j++){
			if(possibilites.noThreat !== undefined && 
				blackThreats.filter(
					(x) => x.x == possibilities[j].x && possibilities[j].y == x.y).length == 0){
				blackThreats.push({"x": possibilities[j].x, "y": possibilities[j].y});
			}
		}
	}

	return {"blackThreats": blackThreats, "whiteThreats": whiteThreats};
}

function MakeMove(board, x1, y1, x2, y2){
	if(x1 < 0){ return undefined;}
	let newBoard = copyBoard(board);
	pieceInfo = getPiece(newBoard, x1, y1);
	//console.log(pieceInfo);
	//console.log(Possible(board, {"p1": {"x": x1, "y": y1}, "p2": {"x": x2, "y": y2}}));
	if(pieceInfo == undefined){return undefined; }
	if(board.turn == "white" && pieceInfo.color == "black"){ return undefined; }
	if(board.turn == "black" && pieceInfo.color == "white"){ return undefined; }
	if(Possible(board, {"p1": {"x": x1, "y": y1}, "p2": {"x": x2, "y": y2}})){
		let capturedPiece = getPiece(newBoard, x2, y2);
		if(capturedPiece !== undefined && capturedPiece.color !== undefined){
			if(capturedPiece.color == "white"){
				for(let i=0; i<newBoard.white.length; i++){
					if(newBoard.white[i].x == capturedPiece.piece.x && newBoard.white[i].y == capturedPiece.piece.y){
						newBoard.white.splice(i, 1);
						break;
					}
				}
			}

			if(capturedPiece.color == "black"){
				for(let i=0; i<newBoard.black.length; i++){
					if(newBoard.black[i].x == capturedPiece.piece.x && newBoard.black[i].y == capturedPiece.piece.y){
						newBoard.black.splice(i, 1);
						break;
					}
				}
			}
		}


		pieceInfo.piece.x = x2;
		pieceInfo.piece.y = y2;
		newBoard.turn = (newBoard.turn == "white") ? "black" : "white";
		let check = inCheck(newBoard);
		if(check != undefined){
			if(board.turn === check){
				return undefined;
			}
		}
		//Checkmate seems to have run into infinite recursion
		// This happens with the stalemate function calling this then calling check mate
		//  A solution may be to make another export for checkmate ( oops )
				//newBoard.checkMate = checkMate(newBoard);

		return newBoard;
	}

	//incomplete Castling
	/*if(isCastleAttempt(board, x1, y1, x2, y2)){
		let castle = castle(board);
		//castle.foreach( function(c){})
	}*/


	//TODO: PAWN PROMOTION
	/*
	let pawnOtherSide = board[board.turn].filter(function (x){
		if(board.turn == "white"){
			if(x.y == 7){
				return true;
			}
		} else{
			if(x.y == 0){
				return true;
			}
		}
	});*/

	return undefined;
}

function isCastleAttempt(board, x1, y1, x2, y2){
	//is this a castle?
	if(board.turn == "white"){
		//white right
		if(x1 == 3 && y1 == 0 && 
			x2 == 1 && y2 == 0){
			return true;
		}

		//white left
		if(x1 == 3 && y1 == 0 && x2 == 5 && y2 == 0){
			return true;
		}
	}
	if(board.turn == "black"){
		//black left
		if(x1 == 3 && y1 == 7 && x2 == 1 && y2 == 0){
			return true;
		}

		//black right
		if(x1 == 3 && y1 == 0 && x2 == 5 && y2 == 0){
			return true;
		}
	}

	return false;
}

//gets two possible castles
function castle(board){
		//code for castle goes here
	let whiteKing = board.white.filter(x => x.name == "Ki")[0];
	let whiteRooks = board.white.filter(x => x.name == "Ro");
	let blackKing = board.black.filter(x => x.name == "Ki")[0];
	let blackRooks = board.black.filter(x => x.name == "Ro");
	let possibilities = [];


	let threats = getThreats(board);
	// Check if squares are threatened

	if(board.turn == "white"){

		if(threats.filter(x => (x.x == 2 && x.y == 0) || (x.x ==1 && x.y == 0)).length == 0){
			//white right possible
		}

		if(threats.filter( x=>(x.x== 5 && x.y == 0) || (x.x == 4 && x.y == 0) || (x.x == 6 && x.y == 0)).length == 0){
			//white left possible
		}
		//check if king is in right spot and hasn't moved
		if(whiteKing.x == 4 && whiteKing.y == 0 && !whiteKing.hasMoved){
			whiteRooks.foreach(function(r){
				if(!r.hasMoved){

					//push to possiblities
					//copyBoard(board)
				}
			});
		}
	}

	if(board.turn == "black"){
		if(threats.filter(x => (x.x == 2 && x.y == 7) || (x.x ==1 && x.y == 7)).length == 0){
			//black left possible
		}

		if(threats.filter( x=>(x.x== 5 && x.y == 7) || (x.x == 4 && x.y == 7) || (x.x == 6 && x.y == 7)).length == 0){
			//black right possible
		}

		if(blackKing.x == 4 && blackKing.y == 0 && !blackKing.hasMoved){
			whiteRooks.foreach(function(r){
				if(!r.hasMoved){
					//push to possiblities
					//copyBoard(board)
				}
			});
		}
	}

	return possibilities;
}

exports.copyBoard = copyBoard;
exports.checkMate = checkMate;
exports.staleMate = staleMate;
exports.startingBoard = startingBoard;
exports.MakeMove = MakeMove;
