const express = require('express');
const router = express.Router();
const config = require('config');
const shortid = require('shortid');
const validUrl = require('valid-url');

const Url = require('../models/Url');

// @route   POST /api/url/shorten
// @desc    Create short URL
router.post('/shorten', async (req, res) => {
    const { longUrl } = req.body;
    const baseUrl = config.get('baseUrl');

    if (!validUrl.isUri(baseUrl)) {
        return res.status(401).json('invalid base url');
    }

    // Create url code
    const urlCode = shortid.generate();

    // Check long url
    if(validUrl.isUri(longUrl)) {
        try {
            let url = await Url.findOne({ longUrl });

            if (url) {
                res.json(url);
            } else {
                const shortUrl = baseUrl + '/' + urlCode;

                url = new Url({
                    longUrl,
                    shortUrl,
                    urlCode,
                    date: new Date()
                });

                await url.save();

                res.json(url);
            }
        } catch (err) {
            console.error(err);
            res.status(500).json('Server error');
        }
    } else {
        res.status(401).json('invalid long url');
    }
})


module.exports = router;