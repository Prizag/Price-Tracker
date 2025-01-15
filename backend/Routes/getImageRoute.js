const express = require('express')
const router = express.Router();
const puppeteer = require('puppeteer')
router.get('/', async (req, res) => {
    const { url } = req.query;
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'en-US,en;q=0.9',
        });
        await page.goto(url, { waitUntil: 'load', timeout: 0 });

        const imageUrl = await page.evaluate(() => {
            return document.querySelector('.imgTagWrapper img')?.src || null;
        });
        await browser.close();

        if (!imageUrl) {
            return res.status(404).json({ error: 'Image not found' });
        }

        res.json({ imageUrl });
    } catch (error) {
        console.error('Error fetching image:', error);
        res.status(500).json({ error: 'Failed to fetch image' });
    }
});


module.exports = router;