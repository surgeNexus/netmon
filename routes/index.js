const express = require('express');
const router = express.Router();
const ping = require('ping');
const Block = require('../models/Block');
const Server = require('../models/Server');
const moment = require('moment');

// async function pingFunc(){
//     Server.find({}, (err, foundServers) => {
//         if(err){console.log(err);}
//         for(let server of foundServers) {
//             Server.findById(server.id, (err, foundServer) => {
//                 if(err){console.log(err)}
//                 const ip = foundServer.ip;
//                 var sys = require('util')
//                 var pinger = require('child_process').exec;
//                 function puts(error, stdout, stderr) { 
//                     if(stdout.includes('64 bytes')){
//                         if(foundServer.status === false){
//                             foundServer.upTime = moment().format('MM-DD-YYYY hh:mm:ss A');
//                         }
//                         foundServer.status = true;
//                         foundServer.save();
//                     } else {
//                         if(foundServer.status === true){
//                             foundServer.downTime = moment().format('MM-DD-YYYY hh:mm:ss A');
//                         }
//                         foundServer.status = false;
//                         foundServer.save();
//                     }
//                 }
//                 pinger(`ping -c 3 ${ip}`, puts);
//             });
//         }
//     });
//     await new Promise(resolve => setTimeout(resolve, 5000));
//     pingFunc()
// }

async function pingFunc(){
    Server.find({}, (err, foundServers) => {
        if(err){console.log(err);}
        for(let server of foundServers) {
            Server.findById(server.id, (err, foundServer) => {
                if(err){console.log(err)}
                const ip = foundServer.ip;
                ping.promise.probe(ip, {
                    timeout: 10,
                    extra: ['-i', '2'],
                }).then(function (res) {
                    if(res.alive === true){
                        if(foundServer.status === false){
                            foundServer.upTime = moment().format('MM-DD-YYYY hh:mm:ss A');
                        }
                        foundServer.status = true;
                        foundServer.latency = res.time;
                        foundServer.save();
                    } else {
                        if(foundServer.status === true){
                            foundServer.downTime = moment().format('MM-DD-YYYY hh:mm:ss A');
                        }
                        foundServer.status = false;
                        foundServer.save();
                    }
                });
            });
        }
    });
    await new Promise(resolve => setTimeout(resolve, 5000));
    pingFunc()
}

router.get('/', (req, res) => {
    Block.find({}).populate('servers').exec((err, foundBlocks) => {
        if(err){
            console.log(err);
            res.redirect('back');
        } else {
            Server.find({}, async(err, foundServers) => {
                if(err){
                    console.log(err)
                } else {
                    pingFunc();
                    res.render('index', {
                        blocks: foundBlocks
                    });
                }
            });
        }
    });
});

module.exports = router;