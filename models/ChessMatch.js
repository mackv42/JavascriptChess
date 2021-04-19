const mongoose = require('mongoose');

const ChessMatchSchema = new mongoose.Schema({
	userId: {
		type: String,
		default: ""
	},
	userName: {
		type: String,
		default: ""
	},
	board: {type: mongoose.Schema.Types.Mixed},
	
	playerColor: {
		type: String,
		default: ""
	},
	finished: {
		type: String,
		default: ""
	}
});

module.exports = mongoose.model('ChessMatch', ChessMatchSchema);
