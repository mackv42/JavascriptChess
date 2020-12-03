var canvas = document.getElementById("ChessBoard");
var context = canvas.getContext("2d");
var chessImg = new Image();

let frames = [{"point1":{"x":0,"y":0},"point2":{"x":213,"y":213},"selected":false,"name":"Ki","group":"White"},{"point1":{"x":213,"y":0},"point2":{"x":426,"y":213},"selected":false,"name":"Qu","group":"White"},{"point1":{"x":426,"y":0},"point2":{"x":640,"y":213},"selected":false,"name":"Bi","group":"White"},{"point1":{"x":640,"y":0},"point2":{"x":853,"y":213},"selected":false,"name":"Kn","group":"White"},{"point1":{"x":853,"y":0},"point2":{"x":1066,"y":213},"selected":false,"name":"Ro","group":"White"},{"point1":{"x":1066,"y":0},"point2":{"x":1280,"y":213},"selected":false,"name":"Pa","group":"White"},{"point1":{"x":0,"y":213},"point2":{"x":213,"y":427},"selected":false,"name":"Ki","group":"Black"},{"point1":{"x":213,"y":213},"point2":{"x":426,"y":427},"selected":false,"name":"Qu","group":"Black"},{"point1":{"x":426,"y":213},"point2":{"x":640,"y":427},"selected":false,"name":"Bi","group":"Black"},{"point1":{"x":640,"y":213},"point2":{"x":853,"y":427},"selected":false,"name":"Kn","group":"Black"},{"point1":{"x":853,"y":213},"point2":{"x":1066,"y":427},"selected":false,"name":"Ro","group":"Black"},{"point1":{"x":1066,"y":213},"point2":{"x":1280,"y":427},"selected":true,"name":"Pa","group":"Black"}];
function Clear(){
	let squareWidth = canvas.width / 8;
	for(let i=0; i<8; i++){
		for(let j=0; j<8; j++){
			color = ((i+j+1)%2 == 0) ? "grey":"brown";
			context.fillStyle = color;
			context.fillRect(i*squareWidth , j*squareWidth, squareWidth, squareWidth);
		}
	}
}


function RenderBoard(board){
	Clear();
	for(let i=0; i<board.white.length; i++){
		let clipData = frames.filter(x => x.name == board.white[i].name && x.group == "White")[0];

		//img, sx, sy, sw, sh, x, y, width, height
		context.drawImage(chessImg, clipData.point1.x, clipData.point1.y, clipData.point2.x -clipData.point1.x, clipData.point2.y - clipData.point1.y,
							canvas.width/8*board.white[i].x, canvas.height/8*board.white[i].y, canvas.width/8, canvas.height/8);
	}
	for(let i=0; i<board.black.length; i++){
		let clipData = frames.filter(x => x.name == board.black[i].name && x.group == "Black")[0];

		//img, sx, sy, sw, sh, x, y, width, height
		context.drawImage(chessImg, clipData.point1.x, clipData.point1.y, clipData.point2.x -clipData.point1.x, clipData.point2.y - clipData.point1.y,
							canvas.width/8*board.black[i].x, canvas.height/8*board.black[i].y, canvas.width/8, canvas.height/8);
	}
}


//List of moves made
var PastMoves = [];

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

const startingBoard = {
	"white": [{"name": "Ro", "x": 0, "y": 0}, {"name":"Kn", "x": 1, "y": 0}, {"name":"Bi", "x": 2, "y": 0}, {"name":"Qu", "x": 3, "y": 0}, {"name":"Ki", "x": 4, "y": 0}, {"name":"Bi", "x": 5, "y": 0}, {"name":"Kn", "x": 6, "y": 0}, {"name":"Ro", "x": 7, "y": 0},
		   {"name":"Pa", "x": 0, "y": 1}, {"name":"Pa", "x": 1, "y": 1}, {"name":"Pa", "x": 2, "y": 1}, {"name":"Pa", "x": 3, "y": 1}, {"name":"Pa", "x": 4, "y": 1}, {"name":"Pa", "x": 5, "y": 1}, {"name":"Pa", "x": 6, "y": 1}, {"name":"Pa", "x": 7, "y": 1}],

	"black": [{"name":"Ro", "x": 0, "y": 7}, {"name":"Kn", "x": 1, "y": 7}, {"name":"Bi", "x": 2, "y": 7}, {"name":"Qu", "x": 3, "y": 7}, {"name":"Ki", "x": 4, "y": 7}, {"name":"Bi", "x": 5, "y": 7}, {"name":"Kn", "x": 6, "y": 7}, {"name":"Ro", "x": 7, "y": 7},
		   {"name":"Pa", "x": 0, "y": 6}, {"name":"Pa", "x": 1, "y": 6}, {"name":"Pa", "x": 2, "y": 6}, {"name":"Pa", "x": 3, "y": 6}, {"name":"Pa", x: 4, "y": 6}, {"name":"Pa", "x": 5, "y": 6}, {"name":"Pa", "x": 6, "y": 6}, {"name":"Pa", "x": 7, "y": 6}],
	"turn": "white"	   
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

function possibleMoves(board, pieceInfo){
	let possibilities = [];
	let piece = pieceInfo.piece;
	let pieceType = PieceNames[piece.name];
	
	if(piece.name == "Pa"){
		//in front of
		//left diagonal
		//right diagonal
		if(pieceInfo.color == "white"){
			if(getPiece(board, piece.x, piece.y+1) === undefined){ possibilities.push({"x": piece.x, "y": piece.y+1}); 
				if(piece.y == 1 && getPiece(board, piece.x, piece.y+2) === undefined){possibilities.push({"x": piece.x, "y": piece.y+2});}}
			if(getPiece(board, piece.x+1, piece.y+1) !== undefined){ possibilities.push({"x": piece.x+1, "y": piece.y+1}); }
			if(getPiece(board, piece.x-1, piece.y+1) !== undefined){ possibilities.push({"x": piece.x-1, "y": piece.y+1}); }
		} else if(pieceInfo.color == "black"){
			if(getPiece(board, piece.x, piece.y-1) === undefined){ possibilities.push({"x": piece.x, "y": piece.y-1}); 
				if(piece.y == 6 && getPiece(board, piece.x, piece.y-2) === undefined){possibilities.push({"x": piece.x, "y": piece.y-2});}}
			if(getPiece(board, piece.x+1, piece.y-1) !== undefined){ possibilities.push({"x": piece.x+1, "y": piece.y-1}); }
			if(getPiece(board, piece.x-1, piece.y-1) !== undefined){ possibilities.push({"x": piece.x-1, "y": piece.y-1}); }
		}
	}

	if(piece.name == "Kn"){
		for(let i=0; i<pieceType.Moves.length; i++){
			let x = piece.x + pieceType.Moves[i].x;
			let y = piece.y + pieceType.Moves[i].y;
			if(!inBounds(x, y)){ continue; }
			//if(getPiece(board, x, y) === undefined){ continue; }
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
function Possible(board, move){
	let SelectedPiece = getPiece(board, move.p1.x, move.p1.y);
	if(SelectedPiece === null){ return false; }
	if(move.p2.x > 7 || move.p2.x < 0 || move.p2.y >7 || move.p2.y < 0){ return false; }
	if(move.p1.x > 7 || move.p1.x < 0 || move.p1.y > 7 || move.p2.y < 0){ return false; }
	
	let PossibleMoves = possibleMoves(board, SelectedPiece);
	//can this piece do that?
	for(let i=0; i<PossibleMoves.length; i++){
		if(PossibleMoves[i].x == move.p2.x && PossibleMoves[i].y == move.p2.y){
			return true;
		}
	}
	//are you in check after a move? false
	return false;
}

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


function MakeMove(board, x1, y1, x2, y2){
// if(!Possible()){ return board; }
	if(x1 < 0){ return undefined;}
	let newBoard = copyBoard(board);
	pieceInfo = getPiece(newBoard, x1, y1);

	if(pieceInfo == undefined){return undefined; }
	if(board.turn == "white" && pieceInfo.color == "black"){ return undefined; }
	if(board.turn == "black" && pieceInfo.color == "white"){ return undefined; }
	if(Possible(board, {"p1": {"x": x1, "y": y1}, "p2": {"x": x2, "y": y2}})){
		let capturedPiece = getPiece(newBoard, x2, y2);
		if(capturedPiece !== undefined && capturedPiece.color !== undefined){
			if(capturedPiece.color == "white"){
				for(let i=0; i<newBoard.white.length; i++){
					if(newBoard.white[i].x == capturedPiece.piece.x && newBoard.white[i].y == capturedPiece.piece.y){
						console.log(i);
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

		console.log(newBoard);

		newBoard.turn = (newBoard.turn == "white") ? "black" : "white";
		let check = inCheck(newBoard);
		if(check != undefined){
			if(board.turn === check){
				return undefined;
			}
		}

		return newBoard;
	}

	return undefined;
}


let selectedSquare = {"x": 0, "y": 0};
let currentBoard = startingBoard;


canvas.onclick = function(evt){
	let clickOffset = canvas.getBoundingClientRect();
	let x = Math.floor((event.clientX - clickOffset.left)/(canvas.width/8));
    let y = Math.floor((event.clientY - clickOffset.top)/(canvas.height/8));
    
    let newBoard = MakeMove(currentBoard, selectedSquare.x, selectedSquare.y, x, y);


    if(newBoard == undefined){
    	selectedSquare.x = x;
    	selectedSquare.y = y;
    	return;
    }

    currentBoard = newBoard;
    selectedSquare.x = -1;

    RenderBoard(currentBoard);
}

chessImg.src = "chessSpritePng.png"
chessImg.onload = function(){
	RenderBoard(currentBoard);
}