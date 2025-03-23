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
        const relianceSearch = `https://www.reliancedigital.in/products?q=${encodeURIComponent(name)}`;
        const chromaSearch = `https://www.croma.com/searchB?q=${encodeURIComponent(name)}`;

        // Flipkart Scraper
        await page.goto(flipkartSearch, { waitUntil: 'load', timeout: 0 });
        let flipkartItem = await page.evaluate(() => {
            let product = document.querySelector('.slAVV4 , .tUxRFH');
            if (!product) return null;

            let linkElement = product.querySelector('a.VJA3rP , a.CGtC98');
            let link = linkElement ? "https://www.flipkart.com" + linkElement.getAttribute('href') : null;
            
            let priceElement = product.querySelector('.Nx9bqj , ._30jeq3'); // Updated price selector
            let price = priceElement?.innerText || "Price not found";

            return { link, price };
        });
        if (flipkartItem) items.push(flipkartItem); // Prevent pushing null

        // Reliance Digital Scraper
        await page.goto(relianceSearch, { waitUntil: 'load', timeout: 0 });
        let relianceItem = await page.evaluate(() => {
            let product = document.querySelector('.card-info-container');
            if (!product) return { link: "Not founder", price: "Price not founder" }; // Ensures it returns something

            let linkElement = product.querySelector('a.product-card-image');
            let link = linkElement ? "https://www.reliancedigital.in" + linkElement.getAttribute('href') : "Not found";

            let priceElement = product.querySelector('.price');
            let price = priceElement?.innerText.trim() || "Price not found";

            return { link, price };
        });
        items.push(relianceItem); // Always push, even if "Not found"

        await page.goto(chromaSearch, { waitUntil: 'load', timeout: 0 });
        let chromaItem = await page.evaluate(() => {
            let product = document.querySelector('product-item');
            if (!product) return { link: "Not founder", price: "Price not founder" }; // Ensures it returns something

            let linkElement = product.querySelector('a');
            let link = linkElement ? "https://www.croma.com" + linkElement.getAttribute('href').replace(/^\/+/, "") : "Not found";

            let priceElement = product.querySelector('span.amount span.plp-srp-new-amount');
            let price = priceElement?.innerText || "Price not found";

            return { link, price };
        });
        items.push(chromaItem); // Always push, even if "Not found"


        await browser.close();
        res.json({ products: items });
    } catch (error) {
        console.error(error);
        await browser.close();
        res.status(500).json({ error: "Something went wrong while scraping." });
    }
});

module.exports = router;