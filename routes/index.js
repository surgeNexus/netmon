const express = require('express');
const router = express.Router();
const Block = require('../models/Block');

router.get('/', (req, res) => {
    Block.find({}, (err, foundBlocks) => {
        if(err){
            req.flash('error', 'Block not found. Please try again.');
            res.redirect('back');
        } else {
            res.render('index', {
                blocks: foundBlocks
            });
        }
    });
});

module.exports = router;