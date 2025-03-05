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
    let items = [];

    try {
        const flipkartSearch = `https://www.flipkart.com/search?q=${encodeURIComponent(name)}`;
        const relianceSearch = `https://www.reliancedigital.in/search?q=${encodeURIComponent(name)}`;
        const chromaSearch = `https://www.croma.com/searchB?q=${encodeURIComponent(name)}`;

        // Flipkart Scraper
        await page.goto(flipkartSearch, { waitUntil: 'load', timeout: 0 });
        let flipkartItem = await page.evaluate(() => {
            let product = document.querySelector('.tUxRFH');
            if (!product) return null;

            let linkElement = product.querySelector('a.CGtC98');
            let link = linkElement ? "https://www.flipkart.com" + linkElement.getAttribute('href') : null;
            
            let priceElement = product.querySelector('._30jeq3'); // Updated price selector
            let price = priceElement?.innerText || "Price not found";

            return { link, price };
        });
        if (flipkartItem) items.push(flipkartItem); // Prevent pushing null

        // Reliance Digital Scraper
        await page.goto(relianceSearch, { waitUntil: 'load', timeout: 0 });
        let relianceItem = await page.evaluate(() => {
            let product = document.querySelector('.product-card');
            if (!product) return null;

            let linkElement = product.querySelector('.card-info-container a');
            let link = linkElement ? "https://www.reliancedigital.in" + linkElement.getAttribute('href') : null;

            let priceElement = product.querySelector('.price-container');
            let price = priceElement?.innerText.trim() || "Price not found";

            return { link, price };
        });
        if (relianceItem) items.push(relianceItem); // Prevent pushing null

        // Croma Scraper
        await page.goto(chromaSearch, { waitUntil: 'load', timeout: 0 });
        let chromaItem = await page.evaluate(() => {
            let product = document.querySelector('.cp-product .typ-plp .plp-srp-typ');
            if (!product) return null;

            let linkElement = product.querySelector('a');
            let link = linkElement ? "https://www.croma.com" + linkElement.getAttribute('href').replace(/^\/+/, "") : null;

            let priceElement = product.querySelector('span.amount span.plp-srp-new-amount');
            let price = priceElement?.innerText || "Price not found";

            return { link, price };
        });
        if (chromaItem) items.push(chromaItem); // Prevent pushing null

        await browser.close();
        res.json({ products: items });
    } catch (error) {
        console.error(error);
        await browser.close();
        res.status(500).json({ error: "Something went wrong while scraping." });
    }
});

module.exports = router;
