const app = require('express')();
const config = require('config');

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const chess = require('./chess.js');

const port = 3000;

const bodyParser = require('body-parser');
const users = require('./routes/signin');


const UserSession = require('./models/UserSession')


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

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

function isAuthenticated(){
	return true;
}

app.post('/requireauth/*', (req, res, next) => {
    const { token } = req.body;
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
    	console.log(sessions);
    	if (sessions.length != 1) {
            return res.send({
                success: false,
                message: 'No sign in'
            }) 
        } else{
            console.log("next");
         	next();
        }
    });
});


app.use('/api/users', users);

const uri = config.get('mongoURI');
console.log(uri);

mongoose.connect(uri, 
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

app.post('/requireauth/makemove', (req, res, next) => {
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
		//newBoard.checkMate = chess.checkMate(newBoard);
		//newBoard.checkMate = chess.checkMate(newBoard);
		res.send(newBoard);
	}

	console.log(newBoard);
	next();
});

app.listen(port, () => {
	console.log('Listening on http://localhost:'+port);
});