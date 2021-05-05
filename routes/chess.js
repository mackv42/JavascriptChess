const express = require('express');
const User = require('../models/User');
const UserSession = require('../models/UserSession')
const ChessMatch = require('../models/ChessMatch');
const chess = require('../chess.js');
const secrets = require('.,/secrets.js');

const router = express.Router();

function coinFlip(){
    if(Math.floor((Math.random() * 100) % 2 == 0)){
        return true;
    } else{ return false; }
}


router.post('/requireauth/*', (req, res, next) => {
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

router.get('/requireauth/getGame', (req, res, next) => {
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
                            res.send({"board": board.board, "playerColor": board.playerColor, "success": true});
                        }
                    });
                } else{
                    res.send({"board": match.board, "playerColor": match.playerColor, "success": true});
                }
            });
    });
})

router.post('/requireauth/makemove', (req, res, next) => {
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
                                    return res.send(newBoard);
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
                                    //newBoard.possibleMoves = chess.getPossibleMoves(newBoard);
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


router.get("/admin/*", (req, res,next) =>{
    const {query} = req;
    const {token} = query;
    //console.log("hit");
    if(token == secrets.secrets.APIKey){
        next();
    } else{
        return res.send({"success": false, "message": "Invalid Key!"})
    }
});

router.post("/admin/*", (req, res, next) =>{
    const {token} = req.body;

    if(token == process.env.APIKey){
        next();
    } else{
        return res.send({"success": false, "message": "Invalid Key!"})
    }
});

//get a board with particular user
router.get("/admin/getboard", (req, res, err) => {
    const {query} = req;
    const {userId} = query;
    ChessMatch.findOne({"userId": userId, "finished": ""},
        (err, match) =>{
            res.send(match);
        }
    );
});

//sends a list of all current games
router.get("/admin/getboards", (req, res, err) => {
    ChessMatch.find({"finished": ""}, (err, matches) =>{
        if(err){
            res.send(err);
        } else{

            return res.send(matches);
        }
    });
});

router.post("/admin/makemove", (req, res, err ) => {
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


module.exports = router;