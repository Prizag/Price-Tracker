const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

router.get('/', async (req, res) => {
    const { name } = req.query;
    if (!name || name.trim().length === 0) {
        return res.status(400).json({ error: 'Query is required' });
    }

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    // ✅ Set custom user-agent and headers to avoid detection
    await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
    );
    await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.google.com',
    });

    let items = [];

    try {
        const flipkartSearch = `https://www.flipkart.com/search?q=${encodeURIComponent(name)}`;
        const relianceSearch = `https://www.reliancedigital.in/search?q=${encodeURIComponent(name)}`;
        const chromaSearch = `https://www.croma.com/searchB?q=${encodeURIComponent(name)}`;

        // 🔹 Flipkart Scraper
        await page.goto(flipkartSearch, { waitUntil: 'networkidle2', timeout: 0 });
        await new Promise(resolve => setTimeout(resolve, 3000));
        await page.evaluate(() => window.scrollBy(0, window.innerHeight)); // Scroll down

        let flipkartItem = await page.evaluate(() => {
            let product = document.querySelector('.tUxRFH');
            if (!product) return { link: "Not found", price: "Price not found" };

            let linkElement = product.querySelector('a.CGtC98');
            let link = linkElement ? "https://www.flipkart.com" + linkElement.getAttribute('href') : "Not found";

            let priceElement = product.querySelector('._30jeq3');
            let price = priceElement?.innerText || "Price not found";

            return { link, price };
        });
        items.push(flipkartItem);

        // 🔹 Reliance Digital Scraper
        await page.goto(relianceSearch, { waitUntil: 'networkidle2', timeout: 0 });
        await new Promise(resolve => setTimeout(resolve, 3000));
        await page.evaluate(() => window.scrollBy(0, window.innerHeight));

        let relianceItem = await page.evaluate(() => {
            let product = document.querySelector('.product-card');
            if (!product) return { link: "Not found", price: "Price not found" };

            let linkElement = product.querySelector('.card-info-container a');
            let link = linkElement ? "https://www.reliancedigital.in" + linkElement.getAttribute('href') : "Not found";

            let priceElement = product.querySelector('.price-container');
            let price = priceElement?.innerText.trim() || "Price not found";

            return { link, price };
        });
        items.push(relianceItem);

        // 🔹 Croma Scraper
        await page.goto(chromaSearch, { waitUntil: 'networkidle2', timeout: 0 });
        await new Promise(resolve => setTimeout(resolve, 3000));
        await page.evaluate(() => window.scrollBy(0, window.innerHeight));

        let chromaItem = await page.evaluate(() => {
            let product = document.querySelector('.cp-product .typ-plp .plp-srp-typ');
            if (!product) return { link: "Not found", price: "Price not found" };

            let linkElement = product.querySelector('a');
            let link = linkElement ? "https://www.croma.com" + linkElement.getAttribute('href').replace(/^\/+/, "") : "Not found";

            let priceElement = product.querySelector('span.amount span.plp-srp-new-amount');
            let price = priceElement?.innerText || "Price not found";

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
