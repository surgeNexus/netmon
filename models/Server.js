var mongoose = require('mongoose');

var ServerSchema = new mongoose.Schema({
    name: String,
    ip: String,
    status: {type: Boolean, default: false},
    order: Number,
    updateTime: Number
});

module.exports = mongoose.model('Server', ServerSchema);
