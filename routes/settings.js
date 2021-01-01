const express = require('express');
const router = express.Router();
const Ping = require('ping-wrapper');
const Block = require('../models/Block');
const Server = require('../models/Server');
const Alert = require('../models/Alert');


router.get('/', async (req, res) => {
    Block.find({}).populate('servers').exec(async(err, foundBlocks) => {
        if(err){
            req.flash('error', 'Block not found. Please try again.');
            res.redirect('back');
        } else {
            Alert.findOne({}, (err, foundAlert) => {
                if(err){
                    console.log(err)
                    res.redirect('back');
                } else {
                    res.render('settings/index', {
                        blocks: foundBlocks,
                        alert: foundAlert
                    });
                }
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

// router.put('/:id/contact', (req, res) => {
//     Alert.findOne({}, (err, foundAlert) => {
//         if(err){
//             req.flash('error', 'Email not added. Please try again.');
//             res.redirect('back');
//         } else {
//             foundAlert.email = req.body.email;
//         }
//     });
// });

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