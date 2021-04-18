let sockData = {
	"wsUrl": "http://localhost:8080",
}

sockData.socket = io.connect(sockData.wsUrl)
function register(token){
	sockData.socket.emit('register', signInData.token);
	sockData.token = signInData.token;
	sockData.socket.on('makemove', function(){
		console.log("emit");
		axios.get("http://localhost:3000/requireauth/getGame?token="+sockData.token).then( function(response){
			if(response.data.success){
				currentBoard = response.data.board;
				currentBoard.playerColor = response.data.playerColor;
				RenderBoard(response.data.board);
			}
		});
	});
}