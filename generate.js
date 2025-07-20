const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });

  const page = await browser.newPage();

  // Set high-resolution screen
  await page.setViewport({
    width: 1440,
    height: 1024,
    deviceScaleFactor: 2, // Retina quality
  });

  // Load your local HTML or served URL
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  // Optional: wait for UI to fully render or animate
  await page.waitForTimeout(1000);

  // Capture screenshot
  await page.screenshot({
    path: 'mockup-ui.png',
    fullPage: false, // or true if the UI is scrollable
    omitBackground: false // set true if you want transparent background
  });

  await browser.close();
})();
