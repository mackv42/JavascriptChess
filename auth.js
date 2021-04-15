const endpoint = "localhost:3000/api/users/";
const signInPath = "signin";
const signUpPath = "signup";
const verifyPath = "verify";

var signInData = {
	"token": ""
}

let signUp = document.getElementById("signUpSbmt");
let signIn = document.getElementById("signInSbmt");

let signUpModal = document.getElementById("signUpModal");
let signInModal = document.getElementById("signInModal");

signUp.onclick = function(evt){
	let data = {
		"email": document.getElementById("signupEmail").value,
		"username": document.getElementById("signupUsername").value,
		"password": document.getElementById("signupPassword").value
	};

	for(var val in Object.values(data)){
		if(!data|| data.length < 1){
			return;
		}
	}

	axios.post("http://"+endpoint+"signup", data).then( function(response){
		console.log(response);
	});
}

signIn.onclick = function(evt){
	let data = {
		"email": document.getElementById("signinEmail").value,
		"password": document.getElementById("signinPassword").value
	}

	for(var val in Object.values(data)){
		if(!data|| data.length < 1){
			return;
		}
	}

	axios.post("http://"+endpoint+"signin", data).then( function(response){
		

		if(response.data.success){
			signInData.token = response.data.token;
			axios.get("http://localhost:3000/requireauth/getGame?token="+signInData.token).then( function(response){
				if(response.data.success){
					currentBoard = response.data.board;
					RenderBoard(response.data.board);
				}
			});

			$("#signInModal").modal('hide');
			document.getElementById("ChessBoard").style.display = "block";

			//GET current chess game
			// Render the chess board
			//  Attach Events
		} else{
			//Notify Error
		}
	});
}

function verify(token){
	axios.get("http://"+endpoint+"verify?"+token).then( function( response ){
		console.log("Verified");
	});
}