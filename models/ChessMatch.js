const mongoose = require('mongoose');

const ChessMatchSchema = new mongoose.Schema({
	userId: {
		type: String,
		default: ""
	},
	board: {type: mongoose.Schema.Types.Mixed},
	finished: {
		type: Boolean,
		default: false
	}
});

module.exports = mongoose.model('ChessMatch', ChessMatchSchema);