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
        let flipkartItems = await page.evaluate(() => {
            let product = document.querySelector('.tUxRFH');
            if (!product) return null;
            let linkElement = product.querySelector('a.CGtC98');
            let link = linkElement ? "https://www.flipkart.com" + linkElement.getAttribute('href') : null;
            let priceElement = product.querySelector('.Nx9bqj ._4b5DiR')
            let price = priceElement?.innerText || "Price not found";

            return {link, price}

        });
        items.push(flipkartItems);

        // Reliance Digital Scraper
        await page.goto(relianceSearch, { waitUntil: 'load', timeout: 0 });
        let relianceItems = await page.evaluate(() => {
            let product = document.querySelector('.cp-product .typ-plp .plp-srp-typ');
            if (!product) return null;
            let linkElement = product.querySelector('a');
            let link = linkElement ? "https://www.croma.com/" + linkElement.getAttribute('href') : null;
            let price = product.querySelector('a')?.innerText || "Price not found";
            return {link, price}
        });
        items.push(...relianceItems);

        // Croma Scraper
        await page.goto(chromaSearch, { waitUntil: 'load', timeout: 0 });
        let chromaItems = await page.evaluate(() => {
                let product = document.querySelector('.cp-product .typ-plp .plp-srp-typ');
                if (!product) return null;
                let linkElement = product.querySelector('a');
                let link = linkElement ? "https://www.croma.com" + linkElement.getAttribute('href').replace(/^\/+/, "") : null;
                let priceElement = product.querySelector('span.amount span.plp-srp-new-amount');
                let price = priceElement?.innerText || "Price not found";
                return {link, price}
        });
        items.push(chromaItems);

        await browser.close();
        res.json({ products: items });
    } catch (error) {
        console.error(error);
        await browser.close();
        res.status(500).json({ error: "Something went wrong while scraping." });
    }
});

module.exports = router;
