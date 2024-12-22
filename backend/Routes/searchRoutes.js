const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer')


router.get('/',async(req,res)=>{
    const {query} = req.query;
    if(query.length === 0)
    {
        return res.status(400).send('Query is required')
    }

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));

    const searchUrl = `https://www.amazon.com/s?k=${encodeURIComponent(query)}`;
    await page.goto(searchUrl, { waitUntil: 'load', timeout: 0 });

    const products = await page.evaluate(()=>{
        const productElements = document.querySelectorAll('.s-main-slot .s-result-item');
        const productList = [];
        productElements.forEach((product)=>{
            const title =  product.querySelector('h2 span')?.textContent || null;
            const image = product.querySelector('img')?.src || null;
            const price = product.querySelector('.a-price span')?.textContent || null;
            const urlLink = product.querySelector('a.a-link-normal')?.getAttribute("href") || null;

            if(title && image && price && urlLink)
            {
                newUrl = `https://www.amazon.com/${urlLink}`
                productList.push({ title, image, price,newUrl });
            }
        })
        return productList;
    })
    await browser.close();
    res.json(products);

})

router.get('/test',(req,res)=>{
    res.send({message:"hello"})
})
module.exports = router;