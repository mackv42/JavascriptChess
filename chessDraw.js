//needed to flip orientation of board
function subtract2d(x1, y1, x2, y2){
	return {"x": x1-x2, "y": y1-y2};
}

var canvas = document.getElementById("ChessBoard");
var context = canvas.getContext("2d");
var chessImg = new Image();
var address = "http://localhost:3000";
var endpoints = {"MakeMove": address+"/requireauth/makemove"};

const squareWidth = 8;
let currentBoard = new Object();
let selectedSquare = {"x": -1, "y": -1};

let frames = [{"point1":{"x":0,"y":0},"point2":{"x":213,"y":213},"selected":false,"name":"Ki","group":"White"},{"point1":{"x":213,"y":0},"point2":{"x":426,"y":213},"selected":false,"name":"Qu","group":"White"},{"point1":{"x":426,"y":0},"point2":{"x":640,"y":213},"selected":false,"name":"Bi","group":"White"},{"point1":{"x":640,"y":0},"point2":{"x":853,"y":213},"selected":false,"name":"Kn","group":"White"},{"point1":{"x":853,"y":0},"point2":{"x":1066,"y":213},"selected":false,"name":"Ro","group":"White"},{"point1":{"x":1066,"y":0},"point2":{"x":1280,"y":213},"selected":false,"name":"Pa","group":"White"},{"point1":{"x":0,"y":213},"point2":{"x":213,"y":427},"selected":false,"name":"Ki","group":"Black"},{"point1":{"x":213,"y":213},"point2":{"x":426,"y":427},"selected":false,"name":"Qu","group":"Black"},{"point1":{"x":426,"y":213},"point2":{"x":640,"y":427},"selected":false,"name":"Bi","group":"Black"},{"point1":{"x":640,"y":213},"point2":{"x":853,"y":427},"selected":false,"name":"Kn","group":"Black"},{"point1":{"x":853,"y":213},"point2":{"x":1066,"y":427},"selected":false,"name":"Ro","group":"Black"},{"point1":{"x":1066,"y":213},"point2":{"x":1280,"y":427},"selected":true,"name":"Pa","group":"Black"}];

function Clear(){
	let squareWidth = canvas.width / 8;
	for(let i=0; i<8; i++){
		for(let j=0; j<8; j++){
			color = ((i+j)%2 == 0) ? "brown":"grey";
			context.fillStyle = color;
			context.fillRect(i*squareWidth , j*squareWidth, squareWidth, squareWidth);
		}
	}
}

function RenderBoard(board){
	Clear();
	if(board.playerColor == "white"){
		for(let i=0; i<board.white.length; i++){
			let clipData = frames.filter(x => x.name == board.white[i].name && x.group == "White")[0];
			//flip orientation to draw
			let flipped = subtract2d(canvas.width-canvas.width/8, canvas.height-canvas.height/8, canvas.width/8*board.white[i].x, canvas.height/8*board.white[i].y);
			//img, sx, sy, sw, sh, x, y, width, height
			context.drawImage(chessImg, clipData.point1.x, clipData.point1.y, clipData.point2.x -clipData.point1.x, clipData.point2.y - clipData.point1.y,
								flipped.x, flipped.y, canvas.width/8, canvas.height/8);
		}
		for(let i=0; i<board.black.length; i++){
			let clipData = frames.filter(x => x.name == board.black[i].name && x.group == "Black")[0];
			let flipped = subtract2d(canvas.width-canvas.width/8, canvas.height-canvas.height/8, canvas.width/8*board.black[i].x, canvas.height/8*board.black[i].y);

			//img, sx, sy, sw, sh, x, y, width, height
			context.drawImage(chessImg, clipData.point1.x, clipData.point1.y, clipData.point2.x -clipData.point1.x, clipData.point2.y - clipData.point1.y,
								flipped.x, flipped.y, canvas.width/8, canvas.height/8);
		}


	} else{
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
}



chessImg.src = "chessSpritepng.png";
chessImg.onload = function(){
	//RenderBoard(currentBoard);
}