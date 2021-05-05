const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
	userId: {
		type: String,
		default: ""
	},
	userName: {
		type: String,
		default: ""
	},
	message:{
		type: String,
		default: ""
	}, 
	timeStamp:{ 
		type: Date,
		default: Date.now()
	}
});

module.exports = mongoose.model('Message', MessageSchema);
