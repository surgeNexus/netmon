var mongoose = require('mongoose');

var AlertSchema = new mongoose.Schema({
    email: String
});

module.exports = mongoose.model('Alert', AlertSchema);
