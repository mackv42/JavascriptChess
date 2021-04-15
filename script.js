var canvas = document.getElementById("ChessBoard");
var context = canvas.getContext("2d");
var chessImg = new Image();
var address = "http://localhost:3000";
var endpoints = {"MakeMove": address+"/requireauth/makemove"};

const squareWidth = 8;

const startingBoard = {
	"white": [{"name": "Ro", "x": 0, "y": 0}, {"name":"Kn", "x": 1, "y": 0}, {"name":"Bi", "x": 2, "y": 0}, {"name":"Qu", "x": 4, "y": 0}, {"name":"Ki", "x": 3, "y": 0}, {"name":"Bi", "x": 5, "y": 0}, {"name":"Kn", "x": 6, "y": 0}, {"name":"Ro", "x": 7, "y": 0},
		   {"name":"Pa", "x": 0, "y": 1}, {"name":"Pa", "x": 1, "y": 1}, {"name":"Pa", "x": 2, "y": 1}, {"name":"Pa", "x": 3, "y": 1}, {"name":"Pa", "x": 4, "y": 1}, {"name":"Pa", "x": 5, "y": 1}, {"name":"Pa", "x": 6, "y": 1}, {"name":"Pa", "x": 7, "y": 1}],

	"black": [{"name":"Ro", "x": 0, "y": 7}, {"name":"Kn", "x": 1, "y": 7}, {"name":"Bi", "x": 2, "y": 7}, {"name":"Qu", "x": 4, "y": 7}, {"name":"Ki", "x": 3, "y": 7}, {"name":"Bi", "x": 5, "y": 7}, {"name":"Kn", "x": 6, "y": 7}, {"name":"Ro", "x": 7, "y": 7},
		   {"name":"Pa", "x": 0, "y": 6}, {"name":"Pa", "x": 1, "y": 6}, {"name":"Pa", "x": 2, "y": 6}, {"name":"Pa", "x": 3, "y": 6}, {"name":"Pa", x: 4, "y": 6}, {"name":"Pa", "x": 5, "y": 6}, {"name":"Pa", "x": 6, "y": 6}, {"name":"Pa", "x": 7, "y": 6}],
	"turn": "white",
	"checkMate": ""
}

let selectedSquare = {"x": -1, "y": -1};
let currentBoard = startingBoard;

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

canvas.onclick = function(evt){
	let clickOffset = canvas.getBoundingClientRect();
	let x = Math.floor((event.clientX - clickOffset.left)/(canvas.width/8));
    let y = Math.floor((event.clientY - clickOffset.top)/(canvas.height/8));

    //-1 meaning select else make move
   	if(selectedSquare.x == -1){
   		selectedSquare.x = x;
   		selectedSquare.y = y;
   	} else{
	    $.post(
	    	endpoints.MakeMove,
	    	{"token": signInData.token, 
	    	 "board": currentBoard,
	    	 "move": {"x1": selectedSquare.x, "y1": selectedSquare.y,
						"x2": x, "y2": y}},

		    function(data){
		    	console.log(data);
		    	if(data === null || data === undefined || data.length == 0){
		    		selectedSquare.x = x;
		    		selectedSquare.y =y;
		    		return;
		    	}

		    	selectedSquare.x = -1;
		    	selectedSquare.y = -1;
		    	currentBoard = data;
		    	RenderBoard(currentBoard);
		    }
		);
	}
}

chessImg.src = "chessSpritepng.png";
chessImg.onload = function(){
	RenderBoard(currentBoard);
}