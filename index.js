const app = require('express')();

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const chess = require('./chess.js');

const port = process.env.PORT || 3000;

const bodyParser = require('body-parser');
const users = require('./routes/signin');

const UserSession = require('./models/UserSession');
const User = require('./models/User');
const ChessMatch = require('./models/ChessMatch');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

const http = require('http').createServer(app);

//const server = http.createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

http.listen(8080);

var connectedUsers = {};
var admin = {};
//https://stackoverflow.com/questions/11356001/socket-io-private-message
/*app.listen(port, () => {
    console.log('Listening on http://localhost:'+port);
});

*/

io.on('connection',function(socket){
/*Create socket for particular user*/
    socket.on('register', function(token){
        UserSession.findOne({_id: token}, function(err, user){
            if(user){
                socket.username = user.userName;
                connectedUsers[user.userName] = socket;
            } 
           
        });
    });
    //create socket for admin
    socket.on('admin', function(data){
        if(data.token == secrets.adminSecret.APIkey){
            admin = socket;
            
        }
    });

    socket.on('move', function(data){
        //is admin loggedin?
        if(Object.keys(admin).length > 1){
            admin.emit("move", {
                userName: "hello", message: "hello"
            });
        }
    })

    socket.on('makemove',function(data){
        const to = data.to,
                message = data.message;
        if(data.key == secrets.adminSecret.APIkey){
            if(connectedUsers.hasOwnProperty(to)){
                connectedUsers[to].emit('makemove',{
                    //The sender's username
                    username : socket.username,

                    //Message sent to receiver
                    message : message
                });
            }
        }
    }); 
});




function coinFlip(){
    if(Math.floor((Math.random() * 100) % 2 == 0)){
        return true;
    } else{ return false; }
}


app.use(function (req, res, next){
	    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use('/api/users', users);

mongoose.connect(process.env.mongoConnection, 
{
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => {
        if(err){
            throw err
        }else{
            console.log('MongoDB Connected');
        }
    }
);

app.post('/requireauth/*', (req, res, next) => {
    const { token } = req.body;

    UserSession.find({
        _id: token,
        isDeleted: false
    },  (err, sessions) => {
        if (err) {
            return res.send({
                success: false,
                message: 'Verification Error.'
            });
    	}
    	
    	if (sessions.length != 1) {
            return res.send({
                success: false,
                message: 'No sign in'
            }) 
        } else{
        	User.find({
        		_id: sessions[0].userId
        	}, (err, user) =>{
        		if(err){
        			res.send({"message": "error", "success": false})
        		} else{
        			console.log(user[0].email);
        			next();
        		}
        	});
        }
    });
});

app.get('/requireauth/getGame', (req, res, next) => {
    const { query } = req;
    const { token } = query;
    console.log(token);
    UserSession.find({
        _id: token,
        isDeleted: false
    },  (err, sessions) => {
        if (err) {
            return res.send({
                success: false,
                message: 'Verification Error.'
            });
        }
        if (sessions.length < 1) {
            return res.send({
                success: false,
                message: 'No session Found'
            })
        }

        let UserId = sessions[0].userId;
        let userName = sessions[0].userName;
        ChessMatch.findOne({userId: UserId, finished: ""}, 
            (err, match) =>{
                if(err){
                    console.log(err);
                } else if(!match){
                    var board = new ChessMatch();
                    board.board = chess.copyBoard(chess.startingBoard);
                    board.userId = UserId;
                    board.userName = userName;
                    if(coinFlip()){
                         board.playerColor = "white";
                    } else{
                        board.playerColor = "black";
                    }

                    board.save((err, x) =>{
                        if(err){
                            console.log("error saving board");
                            return res.send("Error")
                        } else{
                           return res.send({"board": chess.startingBoard, "playerColor": board.playerColor, "success": true});
                        }
                    });
                } else{
                    res.send({"board": match.board, "playerColor": match.playerColor, "success": true});
                }
            });
    });
})

app.post('/requireauth/makemove', (req, res, next) => {
	const { token } = req.body;
	let UserId = "";
	UserSession.find({
        _id: token,
        isDeleted: false
    },  (err, sessions) => {
        if (err) {
            res.send({
                success: false,
                message: 'Verification Error.'
            });
    	}
    	
    	if (sessions.length != 1) {
            res.send({
                success: false,
                message: 'No sign in'
            });
        } else{
        	UserId = sessions[0].userId;
        	//let currentMatch = new ChessMatch();
			ChessMatch.findOne({userId: UserId, finished: ""}, 
		    (err, currentMatch) =>{
		    	if(err){
		    		console.log("f");
		    	} else{
		    		for(let i=0; i<req.body.board.white.length; i++){
                        req.body.board.white[i].x = parseInt(req.body.board.white[i].x, 10);
                        req.body.board.white[i].y = parseInt(req.body.board.white[i].y, 10);
                    }

                    for(let i=0; i<req.body.board.black.length; i++ ){
                        req.body.board.black[i].x = parseInt(req.body.board.black[i].x, 10);
                        req.body.board.black[i].y = parseInt(req.body.board.black[i].y, 10);
                    }

                    let newBoard = chess.MakeMove(currentMatch.board, 
                    parseInt(req.body.move.x1, 10), parseInt(req.body.move.y1, 10), 
                    parseInt(req.body.move.x2, 10), parseInt(req.body.move.y2, 10));

                    if(newBoard === undefined){
                        res.send(undefined);
                    } else{
                        if(!currentMatch || currentMatch.board === undefined){
                            var board = new ChessMatch();
                            board.board = chess.copyBoard(newBoard);
                            board.userId = UserId;
                            board.save((err, x) =>{
                                if(err){
                                    console.log("error saving board");
                                    return res.send("Error")
                                } else{
                                    newBoard.playerColor = board.playerColor;
                                    res.send(newBoard);
                                }
                            });
                        } else{
                            if(currentMatch.playerColor != req.body.board.turn){
                                return res.send(undefined);
                            } else{
                                ChessMatch.findOneAndUpdate({userId: UserId}, {board: chess.copyBoard(newBoard)}).then((doc)=>{
                                    doc.save();
                                    newBoard.playerColor = "";
                                    newBoard.playerColor = currentMatch.playerColor;
                                    return res.send(newBoard);
                                });
                            }
                        }
                    }
		    	}
		    });
        }
    });

	console.log("UserID"+ UserId);
});

app.get("/admin/*", (req, res,next) =>{
    const {query} = req;
    const {token} = query;
    //console.log("hit");
    if(token == process.env.APIkey){
        next();
    } else{
        return res.send({"success": false, "message": "Invalid Key!"})
    }
});

app.post("/admin/*", (req, res, next) =>{
    const {token} = req.body;

    if(token == process.env.APIkey){
        next();
    } else{
        return res.send({"success": false, "message": "Invalid Key!"})
    }
});

//get a board with particular user
app.get("/admin/getboard", (req, res, err) => {
    const {query} = req;
    const {userId} = query;
    ChessMatch.findOne({"userId": userId, "finished": ""},
        (err, match) =>{
            res.send(match);
        }
    );
});

//sends a list of all current games
app.get("/admin/getboards", (req, res, err) => {
    ChessMatch.find({"finished": ""}, (err, matches) =>{
        if(err){
            res.send(err);
        } else{

            return res.send(matches);
        }
    });
});

app.post("/admin/makemove", (req, res, err ) => {
    let {board} = req.body;
    let {move} = req.body;
    //console.log(board);
    ChessMatch.findOne({userId: board.id, finished: ""}, 
        (err, currentMatch) =>{//
            if(err || !currentMatch || currentMatch === undefined){
                return res.send({"message": "no board found", "success": false});
            } else{
                for(let i=0; i<req.body.board.white.length; i++){
                    req.body.board.white[i].x = parseInt(req.body.board.white[i].x, 10);
                    req.body.board.white[i].y = parseInt(req.body.board.white[i].y, 10);
                }

                for(let i=0; i<req.body.board.black.length; i++ ){
                    req.body.board.black[i].x = parseInt(req.body.board.black[i].x, 10);
                    req.body.board.black[i].y = parseInt(req.body.board.black[i].y, 10);
                }
                if(currentMatch.playerColor == currentMatch.turn){
                    return res.send({"message": "not your turn", "success": false});
                }
                let newBoard = chess.MakeMove(currentMatch.board, 
                parseInt(req.body.move.x1, 10), parseInt(req.body.move.y1, 10), 
                parseInt(req.body.move.x2, 10), parseInt(req.body.move.y2, 10));

                if(newBoard === undefined){
                    res.send(undefined);
                } else{
                    if(!currentMatch || currentMatch.board === undefined){
                        return res.send({"message": "no board found", "success": false});
                        
                    } else{
                        
                            ChessMatch.findOneAndUpdate({userId: board.id}, {board: chess.copyBoard(newBoard)}).then((doc)=>{
                                doc.save();
                                newBoard.playerColor = "";
                                newBoard.playerColor = currentMatch.playerColor;
                                newBoard.userId = currentMatch.userId;
                                return res.send(newBoard);
                            });
                    }
                }
            }
        });
});

