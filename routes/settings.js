const express = require('express');
const router = express.Router();
const Block = require('../models/Block');
const Server = require('../models/Server');

router.get('/', (req, res) => {
    Block.find({}).populate('servers').exec((err, foundBlocks) => {
        if(err){
            req.flash('error', 'Block not found. Please try again.');
            res.redirect('back');
        } else {
            res.render('settings', {
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
            })
        }
    });
});

module.exports = router;