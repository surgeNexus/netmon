var mongoose = require('mongoose');

var BlockSchema = new mongoose.Schema({
    name: String,
    servers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Server",
        }
    ]
});

module.exports = mongoose.model('Block', BlockSchema);
