const express = require('express')
const router = express.Router();
const puppeteer = require('puppeteer')

router.get('/',async(req,res)=>{
    const {query} = req.query
    if(query.length === 0)
    {
        return res.status(400).send('Query is required')
    }

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(query, { waitUntil: 'load', timeout: 0 });
    
    const imagesUrl = await page.evaluate(()=>{
        const theUrl = document.querySelector('.imgTagWrapper img')?.src;
        return theUrl;
    })
    await browser.close()
    res.json(imagesUrl)

})  

module.exports = router;