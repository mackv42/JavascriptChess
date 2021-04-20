let sockData = {
	"wsUrl": "https://javascript-chess-7p9ri.ondigitalocean.app",
}

sockData.socket = io.connect(sockData.wsUrl);
function register(token){
	sockData.socket.emit('register', signInData.token);
	sockData.token = signInData.token;
	sockData.socket.on('makemove', function(){
		console.log("emit");
		axios.get("https://javascript-chess-7p9ri.ondigitalocean.app/requireauth/getGame?token="+sockData.token).then( function(response){
			if(response.data.success){
				currentBoard = response.data.board;
				currentBoard.playerColor = response.data.playerColor;
				RenderBoard(response.data.board);
			
			}
		});
	});
}
