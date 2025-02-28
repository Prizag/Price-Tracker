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
            let products = [];
            document.querySelectorAll('._1AtVbE').forEach((product) => {
                let title = product.querySelector('._4rR01T')?.innerText || product.querySelector('.IRpwTa')?.innerText;
                let price = product.querySelector('._30jeq3')?.innerText;
                let linkElement = product.querySelector('a._1fQZEK') || product.querySelector('a._2UzuFa');
                let link = linkElement ? "https://www.flipkart.com" + linkElement.getAttribute('href') : null;
                if (title && price && link) products.push({ title, price, link });
            });
            return products;
        });
        items.push(...flipkartItems);

        // Reliance Digital Scraper
        await page.goto(relianceSearch, { waitUntil: 'load', timeout: 0 });
        let relianceItems = await page.evaluate(() => {
            let products = [];
            document.querySelectorAll('.sp__product').forEach((product) => {
                let title = product.querySelector('.sp__name')?.innerText;
                let price = product.querySelector('.sp__price')?.innerText;
                let linkElement = product.querySelector('a.sp__product-link');
                let link = linkElement ? "https://www.reliancedigital.in" + linkElement.getAttribute('href') : null;
                if (title && price && link) products.push({ title, price, link });
            });
            return products;
        });
        items.push(...relianceItems);

        // Croma Scraper
        await page.goto(chromaSearch, { waitUntil: 'load', timeout: 0 });
        let chromaItems = await page.evaluate(() => {
            let products = [];
            document.querySelectorAll('.product-item').forEach((product) => {
                let title = product.querySelector('.product-title')?.innerText;
                let price = product.querySelector('.amount')?.innerText;
                let linkElement = product.querySelector('a.product-title');
                let link = linkElement ? "https://www.croma.com" + linkElement.getAttribute('href') : null;
                if (title && price && link) products.push({ title, price, link });
            });
            return products;
        });
        items.push(...chromaItems);

        await browser.close();
        res.json({ products: items });
    } catch (error) {
        console.error(error);
        await browser.close();
        res.status(500).json({ error: "Something went wrong while scraping." });
    }
});

module.exports = router;
