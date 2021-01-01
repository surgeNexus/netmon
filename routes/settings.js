const express = require('express');
const router = express.Router();
const Ping = require('ping-wrapper');
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

router.get('/', async (req, res) => {
    Block.find({}).populate('servers').exec(async(err, foundBlocks) => {
        if(err){
            req.flash('error', 'Block not found. Please try again.');
            res.redirect('back');
        } else {
            res.render('settings/index', {
                blocks: foundBlocks
            });
        }
    });
});

router.post('/', (req, res) => {
    const newBlock = {
        name: req.body.name
    }
    Block.create(newBlock, (err, block) => {
        if(err){
            req.flash('error', 'Block not found. Please try again.');
            res.redirect('back');
        } else {
            res.redirect('/settings');
        }
    });
});

router.post('/:id', (req, res) => {
    Block.findById(req.params.id, (err, foundBlock) => {
        if(err){
            req.flash('error', 'Block not found. Please try again.');
            res.redirect('back');
        } else {
            const newServer = {
                name: req.body.name,
                ip: req.body.ip
            }
            Server.create(newServer, (err, server) => {
                if(err){
                    req.flash('error', 'Server not created. Please try again.');
                    res.redirect('back');
                } else {
                    foundBlock.servers.push(server);
                    foundBlock.save();
                    res.redirect('/settings');
                }
            });
        }
    });
});

router.delete('/:id', (req, res) => {
    Server.findByIdAndDelete(req.params.id, (err) => {
        if(err){
            req.flash('error', 'Resource not removed. Please try again.');
            res.redirect('back');
        } else {
            res.redirect('/settings');
        }
    });
});

module.exports = router;