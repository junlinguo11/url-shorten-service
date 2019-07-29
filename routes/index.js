const express = require('express');
const router = express.Router();

const Url = require('../models/Url');

// @route   Get /:code
// @desc    Redirect to long/original URL
router.get('/:code', async (req, res) => {
    try {
        const url = await Url.findOne({ urlCode: req.params.code });

        if (url) {
            return res.redirect(url.longUrl);
        } else {
            return res.status(404).json('No url found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).json('Server error');
    }
});

router.get('/act/jump', (req, res) => {
    try {
        const isWechat = !!req.headers['user-agent'].match(/MicroMessenger/);

        if (isWechat) {
            res.setHeader('content-type', 'text/plain;charset=UTF-8');
            res.setHeader('Content-Disposition', 'attachment;filename=load.apk');

            res.send('redirect');
        } else {
            res.redirect('https://www.qq.com');
        }
    } catch (err) {
        console.error(err);
        res.status(500).json('Server error');
    }
});


module.exports = router;