const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  await page.goto('http://localhost:5174', { waitUntil: 'load' });
  
  await page.evaluate(() => {
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('userRole', 'admin');
    localStorage.setItem('username', 'admin');
  });
  
  await page.reload({ waitUntil: 'load' });
  
  console.log("Logged in. Taking screenshot...");
  await page.screenshot({ path: 'screenshot-logged-in.png' });
  
  await browser.close();
})();
