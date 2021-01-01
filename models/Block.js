var mongoose = require('mongoose');

var BlockSchema = new mongoose.Schema({
    name: String,
    servers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Server",
        }
    ],
    darkMode: { type: Boolean, default: false }
});

module.exports = mongoose.model('Block', BlockSchema);
