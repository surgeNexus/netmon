var mongoose = require('mongoose');

var ServerSchema = new mongoose.Schema({
    name: String,
    ip: String,
    updateInterval: Number
});

module.exports = mongoose.model('Server', ServerSchema);
