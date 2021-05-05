const app = require('express')();

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const port = process.env.PORT || 3000;
const secrets = require('./secrets');

const bodyParser = require('body-parser');
const users = require('./routes/signin');
const chess = require('./routes/chess.js');

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

http.listen(port);

var connectedUsers = {};
var admin = {};

//https://stackoverflow.com/questions/11356001/socket-io-private-message
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
        if(data.token == process.env.APIkey){
            admin = socket;
            
        }
    });

    socket.on('move', function(data){
        //is admin loggedin?
        if(Object.keys(admin).length >= 1){
            admin.emit("move", {
                userName: "hello", message: "hello"
            });
        }
    })

    socket.on('makemove',function(data){
        const to = data.to,
                message = data.message;
        if(data.key == process.env.APIKey){
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


app.use(function (req, res, next){
	    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', '*');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use('/api/users', users);
app.use('/', chess);

mongoose.connect(secrets.secrets.mongodbURI, 
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


//. Message Controllers Here

app.post("/requireauth/message", (req, res, next) =>{
    const message = {req.body}
    const username = {req.body}
    const token = {req.body}

    UserSession.findOne({token: token}, (err, session) =>{

    });
});