const express = require('express');
const router = express.Router();
const Block = require('../models/Block');
const Server = require('../models/Server');
const moment = require('moment');

async function pinger(){
    Server.find({}, (err, foundServers) => {
        if(err){console.log(err);}
        for(let server of foundServers) {
            Server.findById(server.id, (err, foundServer) => {
                if(err){console.log(err)}
                const ip = foundServer.ip;
                var sys = require('util')
                var pinger = require('child_process').exec;
                function puts(error, stdout, stderr) { 
                    if(stdout.includes('64 bytes')){
                        foundServer.status = true;
                        foundServer.updateTime = moment().format('hh:mm:ss A');
                        foundServer.save();
                    } else {
                        foundServer.status = false;
                        foundServer.updateTime = moment().format('hh:mm:ss A');
                        foundServer.save();
                    }
                }
                pinger(`ping -c 3 ${ip}`, puts);
            });
        }
    });
    await new Promise(resolve => setTimeout(resolve, 5000));
    pinger()
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
                    pinger();
                    res.render('index', {
                        blocks: foundBlocks
                    });
                }
            });
        }
    });
});

module.exports = router;