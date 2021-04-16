const app = require('express')();

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const chess = require('./chess.js');

const port = 3000;

const bodyParser = require('body-parser');
const users = require('./routes/signin');
const secrets = require('./secret.js');

const UserSession = require('./models/UserSession');
const User = require('./models/User');
const ChessMatch = require('./models/ChessMatch');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', ws => {
  ws.on('message', message => {
    console.log(`Received message => ${message}`)
  })
  ws.send('Hello! Message From Server!!')
});


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

mongoose.connect("mongodb://localhost/test", 
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
        			console.log("Can not find user");
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
        ChessMatch.findOne({userId: UserId, finished: false}, 
            (err, match) =>{
                if(err){
                    console.log(err);
                } else if(!match){
                    var board = new ChessMatch();
                    board.board = chess.copyBoard(chess.startingBoard);
                    board.userId = UserId;
                    board.userName = userName;

                    board.save((err, x) =>{
                        if(err){
                            console.log("error saving board");
                            return res.send("Error")
                        } else{
                           return res.send({"board": chess.startingBoard, "success":true});
                        }
                    });
                } else{
                    res.send({"board": match.board, "success": true});
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
			ChessMatch.findOne({userId: UserId, finished: false}, 
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

                    let newBoard = chess.MakeMove(req.body.board, 
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
                                    res.send(newBoard);
                                }
                            });
                        } else{
                            //console.log("yep");
                            ChessMatch.findOneAndUpdate({userId: UserId}, {board: chess.copyBoard(newBoard)}).then((doc)=>{
                                doc.save();
                                res.send(newBoard);
                            });
                        }
                    }
		    	}
		    });

			
        }
    });

	console.log("UserID"+ UserId);
});

app.get("/admin/*", (req, res, err, next) =>{
    const {query} = req;
    const {token} = query;

    if(token == secrets.adminSecret.APIkey){
        console.log("Hello Vince!");
    } else{
        return res.send({"success": false, "message": "Invalid Key!"})
    }
    next();

});

//get a board with particular user
app.get("/admin/getboard", (req, res, err) => {
    const {query} = req;
    const {username} = query;
    User.findone({"userName": username}, (err, user)=> {
        if(err){
            res.send({"message": err, "success": false});
        } else if(!user){
            res.send({"message": "no user found", "success": false});
        } else{
            ChessMatch.findone({"userId": User.userid, "finished": false},
                (err, match) =>{
                    res.send(match);
                }
            );
        }
    });
});

//sends a list of all current games
app.get("/admin/getboards", (req, res, err) => {
    ChessMatch.find({"finished": false}, (err, matches) =>{
        if(err){
            res.send(err);
        } else{

            return res.send(matches);
        }
    });
});

app.listen(port, () => {
	console.log('Listening on http://localhost:'+port);
});
