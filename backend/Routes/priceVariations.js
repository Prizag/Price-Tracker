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
        priceList = []
        const flipkartSearch = `https://www.flipkart.com/search?q=${encodeURIComponent(name)}`;
        const relianceSearch = `https://www.reliancedigital.in/products?q=${encodeURIComponent(name)}`;
        const chromaSearch = `https://www.croma.com/searchB?q=${encodeURIComponent(name)}`

    
    } catch (error) 
    {
        console.log(error)
    }
});

module.exports = router;