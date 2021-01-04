var mongoose = require('mongoose');

var ServerSchema = new mongoose.Schema({
    name: String,
    ip: String,
    status: {type: Boolean, default: false},
    upTime: String,
    downTime: String,
    timeUpdated: {type: Boolean, default: false},
    latency: String
});

// module.exports.getStatus = (status,  cb) => {  
//     status.find((err, statusData) => {  
//         if(err){  
//             cb(err, null);  
//         }else{  
//             cb(null, statusData);  
//         }  
//     });
// }

// module.exports.getTime = (updateTime,  cb) => {  
//     updateTime.find((err, timeData) => {  
//         if(err){  
//             cb(err, null);  
//         }else{
//             cb(null, timeData);  
//         }  
//     });
// }

module.exports = mongoose.model('Server', ServerSchema);
