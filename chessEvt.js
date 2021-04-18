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
		    		return;
		    	}

		    	selectedSquare.x = -1;
		    	selectedSquare.y = -1;
		    	currentBoard = data;
		    	RenderBoard(currentBoard);

		    		sockData.socket.emit("move", {to: "admin", message: "hi"});
		    }
		);
	}
}