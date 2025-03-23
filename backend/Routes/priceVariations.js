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

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    await page.setViewport({ width: 1366, height: 768 });

    try {
        const flipkartSearch = `https://www.flipkart.com/search?q=${encodeURIComponent(name)}`;
        const relianceSearch = `https://www.reliancedigital.in/products?q=${encodeURIComponent(name)}`;
        const chromaSearch = `https://www.croma.com/search/?text=${encodeURIComponent(name)}`;

        // Flipkart Scraper
        await page.goto(flipkartSearch, { waitUntil: 'load', timeout: 0 });
        await new Promise(resolve => setTimeout(resolve, 1000));
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
        await new Promise(resolve => setTimeout(resolve, 1000));
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

        await page.goto(chromaSearch, { waitUntil: 'networkidle2', timeout: 0 });
        // await new Promise(resolve => setTimeout(resolve, 3000));
        let chromaItem = await page.evaluate(() => {
            // Select the first product item
            let product = document.querySelector('li.product-item');
            if (!product) return { link: "Not found", price: "Price not found" };
        
            // Extract the product link
            let linkElement = product.querySelector('a');
            let link = linkElement ? "https://www.croma.com" + linkElement.getAttribute('href').replace(/^\/+/, "") : "Not found";
        
            // Extract the product price
            let priceElement = product.querySelector('span.amount');
            let price = priceElement ? priceElement.innerText.trim() : "Price not found";
        
            return { link, price };
        });
        items.push(chromaItem);


        await browser.close();
        res.json({ products: items });
    } catch (error) {
        console.error(error);
        await browser.close();
        res.status(500).json({ error: "Something went wrong while scraping." });
    }
});

module.exports = router;