let sockData = {
	"wsUrl": "http://localhost:8080",
}

sockData.socket = io.connect(sockData.wsUrl);

function register(token){
	sockData.socket.emit("admin", {token: token});
}
register(adminSecret.APIkey);


function makemove(username){
	sockData.socket.emit("makemove", {to: username, key: adminSecret.APIkey, message: "Hi"});
}