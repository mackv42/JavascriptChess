canvas.onclick = function(evt){
	let clickOffset = canvas.getBoundingClientRect();
	let clickData ={
	"x": Math.floor((event.clientX - clickOffset.left)/(canvas.width/8)),
    "y": Math.floor((event.clientY - clickOffset.top)/(canvas.height/8))};

    if(currentBoard.playerColor == "white"){
    	clickData = subtract2d(7, 7, clickData.x, clickData.y)
    	console.log(clickData);
    }

    //-1 meaning select else make move
   	if(selectedSquare.x == -1){
   		selectedSquare.x = clickData.x;
   		selectedSquare.y = clickData.y;

   		let possible = [];
   		if(currentBoard.turn == "black"){
   			let selectedPiece = currentBoard.black.filter(x => x.x == selectedSquare.x && x.y == selectedSquare.y);
   			console.log(selectedPiece);
   			if(selectedPiece.length > 0){
		   		possible = possibleMoves(currentBoard, 
		   			{"color": "black", "piece": selectedPiece[0]});
	   		}
   		} else{
   			let selectedPiece = currentBoard.white.filter(x => x.x == selectedSquare.x && x.y == selectedSquare.y);
   			console.log(selectedPiece);
   			if(selectedPiece.length > 0){
		   		possible = possibleMoves(currentBoard, 
		   			{"color": "white", "piece": selectedPiece[0]});
	   		}
   		}
   		console.log(possible);
   		Clear(selectedSquare, possible);
   		RenderBoard(currentBoard);
   	} else{
	    $.post(
	    	endpoints.MakeMove,
	    	{"token": signInData.token, 
	    	 "board": currentBoard,
	    	 "move": {"x1": selectedSquare.x, "y1": selectedSquare.y,
						"x2": clickData.x, "y2": clickData.y}},

		    function(data){
		    	console.log(data);
		    	if(data === null || data === undefined || data.length == 0){
		    		selectedSquare.x = clickData.x;
		    		selectedSquare.y = clickData.y;

		    		let possible = [];
			   		if(currentBoard.turn == "black"){
			   			let selectedPiece = currentBoard.black.filter(x => x.x == selectedSquare.x && x.y == selectedSquare.y);
			   			console.log(selectedPiece);
			   			if(selectedPiece.length > 0){
					   		possible = possibleMoves(currentBoard, 
					   			{"color": "black", "piece": selectedPiece[0]});
				   		}
			   		} else{
			   			let selectedPiece = currentBoard.white.filter(x => x.x == selectedSquare.x && x.y == selectedSquare.y);
			   			console.log(selectedPiece);
			   			if(selectedPiece.length > 0){
					   		possible = possibleMoves(currentBoard, 
					   			{"color": "white", "piece": selectedPiece[0]});
				   		}
			   		}
		    		Clear(selectedSquare, possible);
   					RenderBoard(currentBoard);
		    		return;
		    	}

		    	selectedSquare.x = -1;
		    	selectedSquare.y = -1;
		    	currentBoard = data;
		    	Clear();
		    	RenderBoard(currentBoard);

		    	sockData.socket.emit("move", {to: "admin", message: "hi"});
		    }
		);
	}
}