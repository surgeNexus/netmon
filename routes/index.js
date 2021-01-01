const express = require('express');
const router = express.Router();
const Block = require('../models/Block');
const Server = require('../models/Server');



function pinger(server, callback){
    const ip = server.ip;
    var sys = require('util')
    var pinger = require('child_process').exec;
    function puts(error, stdout, stderr) { 
        if(stdout.includes('64 bytes')){
            return callback(stdout);
        } else {
            console.log('No Hit')
        }
    }
    pinger(`ping -c 3 ${ip}`, puts);
}

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
                        foundServer.save();
                    } else {
                        foundServer.status = false;
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
            req.flash('error', 'Block not found. Please try again.');
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