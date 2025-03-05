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
        const flipkartSearch = `https://www.flipkart.com/search?q=${encodeURIComponent(name)}`;
        const relianceSearch = `https://www.reliancedigital.in/search?q=${encodeURIComponent(name)}`;
        const chromaSearch = `https://www.croma.com/searchB?q=${encodeURIComponent(name)}`;

        // Run all scrapers concurrently using Promise.all()
        const [flipkartItem, relianceItem, chromaItem] = await Promise.all([
            scrapeFlipkart(page, flipkartSearch),
            scrapeReliance(page, relianceSearch),
            scrapeCroma(page, chromaSearch),
        ]);

        await browser.close();
        
        // Return all fetched data together
        res.json({ products: [flipkartItem, relianceItem, chromaItem].filter(Boolean) }); // Remove null values

    } catch (error) {
        console.error(error);
        await browser.close();
        res.status(500).json({ error: "Something went wrong while scraping." });
    }
});

async function scrapeFlipkart(page, url) {
    await page.goto(url, { waitUntil: 'load', timeout: 0 });
    return await page.evaluate(() => {
        let product = document.querySelector('.tUxRFH');
        if (!product) return null;

        let linkElement = product.querySelector('a.CGtC98');
        let link = linkElement ? "https://www.flipkart.com" + linkElement.getAttribute('href') : null;

        let priceElement = product.querySelector('._30jeq3');
        let price = priceElement?.innerText || "Price not found";

        return { site: "Flipkart", link, price };
    });
}

async function scrapeReliance(page, url) {
    await page.goto(url, { waitUntil: 'load', timeout: 0 });
    return await page.evaluate(() => {
        let product = document.querySelector('.product-card');
        if (!product) return null;

        let linkElement = product.querySelector('.card-info-container a');
        let link = linkElement ? "https://www.reliancedigital.in" + linkElement.getAttribute('href') : null;

        let priceElement = product.querySelector('.price-container');
        let price = priceElement?.innerText.trim() || "Price not found";

        return { site: "Reliance Digital", link, price };
    });
}

async function scrapeCroma(page, url) {
    await page.goto(url, { waitUntil: 'load', timeout: 0 });
    return await page.evaluate(() => {
        let product = document.querySelector('.cp-product .typ-plp .plp-srp-typ');
        if (!product) return null;

        let linkElement = product.querySelector('a');
        let link = linkElement ? "https://www.croma.com" + linkElement.getAttribute('href').replace(/^\/+/, "") : null;

        let priceElement = product.querySelector('span.amount span.plp-srp-new-amount');
        let price = priceElement?.innerText || "Price not found";

        return { site: "Croma", link, price };
    });
}

module.exports = router;
