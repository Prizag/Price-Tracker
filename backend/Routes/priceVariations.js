const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');

router.get('/', async (req, res) => {
    const { name } = req.query;
    if (!name || name.trim().length === 0) {
        return res.status(400).json({ error: 'Query is required' });
    }

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    try {
        let results = [];

        // Amazon Scraping
        await page.goto(`https://www.amazon.com/s?k=${encodeURIComponent(name)}`, { waitUntil: 'domcontentloaded' });
        const amazonPrices = await page.evaluate(() => {
            const items = [];
            document.querySelectorAll('.s-main-slot .s-result-item').forEach(item => {
                const title = item.querySelector('h2 a span')?.innerText;
                const price = item.querySelector('.a-price .a-offscreen')?.innerText;
                if (title && price) {
                    items.push({ source: 'Amazon', title, price });
                }
            });
            return items;
        });
        results = results.concat(amazonPrices);

        // Flipkart Scraping
        await page.goto(`https://www.flipkart.com/search?q=${encodeURIComponent(name)}`, { waitUntil: 'domcontentloaded' });
        const flipkartPrices = await page.evaluate(() => {
            const items = [];
            document.querySelectorAll('._1AtVbE').forEach(item => {
                const title = item.querySelector('._4rR01T')?.innerText;
                const price = item.querySelector('._30jeq3')?.innerText;
                if (title && price) {
                    items.push({ source: 'Flipkart', title, price });
                }
            });
            return items;
        });
        results = results.concat(flipkartPrices);

        // eBay Scraping
        await page.goto(`https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(name)}`, { waitUntil: 'domcontentloaded' });
        const ebayPrices = await page.evaluate(() => {
            const items = [];
            document.querySelectorAll('.s-item').forEach(item => {
                const title = item.querySelector('.s-item__title')?.innerText;
                const price = item.querySelector('.s-item__price')?.innerText;
                if (title && price) {
                    items.push({ source: 'eBay', title, price });
                }
            });
            return items;
        });
        results = results.concat(ebayPrices);

        await browser.close();
        return res.json({ product: name, prices: results });
    } catch (error) {
        await browser.close();
        return res.status(500).json({ error: 'Failed to fetch product prices', details: error.message });
    }
});

module.exports = router;