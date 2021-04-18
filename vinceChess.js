function subtract2d(x1, y1, x2, y2){
	return {"x": x1-x2, "y": y1-y2};
}

var canvas = document.getElementById("ChessBoard");
var context = canvas.getContext("2d");
var chessImg = new Image();
var address = "http://localhost:3000";
var endpoints = {"MakeMove": address+"/requireauth/makemove"};
let currentBoard = new Object();
const squareWidth = 8;

let selectedSquare = {"x": -1, "y": -1};

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
	if(board.playerColor != "white"){
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

canvas.onclick = function(evt){
	let clickOffset = canvas.getBoundingClientRect();
	let clickData ={
	"x": Math.floor((event.clientX - clickOffset.left)/(canvas.width/8)),
    "y": Math.floor((event.clientY - clickOffset.top)/(canvas.height/8))};

    if(currentBoard.playerColor != "white"){
    	clickData = subtract2d(7, 7, clickData.x, clickData.y)
    	console.log(clickData);
    }

    //-1 meaning select else make move
   	if(selectedSquare.x == -1){
   		selectedSquare.x = clickData.x;
   		selectedSquare.y = clickData.y;
   	} else{
	    $.post(
	    	address+"/admin/makemove",
	    	{"token": adminSecret.APIkey, 
	    	 "board": currentBoard,
	    	 "move": {"x1": selectedSquare.x, "y1": selectedSquare.y,
						"x2": clickData.x, "y2": clickData.y}},

		    function(data){
		    	console.log(data);
		    	if(data === null || data === undefined || data.length == 0){
		    		selectedSquare.x = clickData.x;
		    		selectedSquare.y = clickData.y;
		    		return;
		    	}

		    	selectedSquare.x = -1;
		    	selectedSquare.y = -1;
		    	
		    	let userName = currentBoard.userName;
		    	currentBoard = data;
		    	currentBoard.userName= userName;

		    	makemove(userName);
		    	RenderBoard(currentBoard);
		    }
		);
	}
}

chessImg.src = "chessSpritepng.png";

let chessList = document.getElementById("chessBoardList");

$.get(address+"/admin/getboards?token=" + adminSecret.APIkey, function(data){
	console.log(data);
	for(let i = 0; i<data.length; i++){
		var node = document.createElement("a");
		node.href = "#" + data[i].userId;
		var textnode = document.createTextNode("Game with " + data[i].userName);
		node.appendChild(textnode);

		chessList.appendChild(node);
		node.onclick = function (){
			let userId = this.href.substring(this.href.indexOf("#")+1);
			//console.log(this.href.substring(this.href.indexOf("#")+1));

			$.get(address + "/admin/getboard?userId="+userId+"&token="+adminSecret.APIkey, function(data){
				document.getElementById("ChessBoard").display = "block";
				currentBoard = data.board;
				currentBoard.id = data.userId;
				currentBoard.userName = data.userName;
				currentBoard.playerColor = data.playerColor;
				RenderBoard(currentBoard);
			});
		}
	}
});

sockData.socket.on('move', function(dat){
	//console.log("emit");
	$.get(address + "/admin/getboard?userId="+currentBoard.userId+"&token="+adminSecret.APIkey, function(data){
				document.getElementById("ChessBoard").display = "block";
				console.log(currentBoard);
				console.log(currentBoard.userName);
				if(!data){
					console.log("no data");
					return;
				}
				currentBoard = data.board;
				currentBoard.id = data.userId;
				currentBoard.userName = data.userName;
				currentBoard.playerColor = data.playerColor;
				RenderBoard(currentBoard);
			});
});

/*
chessImg.onload = function(){
	RenderBoard(currentBoard);
}*/