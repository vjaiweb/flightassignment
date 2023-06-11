const puppeteer = require('puppeteer');

async function getFlightPrices(source, destination, date) {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  await page.goto('https://www.google.com/travel/flights');
 
   
  await page.waitForSelector('input[name="source"]');
  await page.type('input[name="source"]', source);
  await page.waitForSelector('input[name="destination"]');
  await page.type('input[name="destination"]', destination);
  await page.waitForSelector('input[name="date"]');
  await page.type('input[name="date"]', date);

  await page.keyboard.press('Enter');

  await page.waitForNavigation({ waitUntil: 'networkidle2' });

  const prices = await page.evaluate(() => {
    const priceElements = document.querySelectorAll('.gws-flights-results__price');
    const prices = [];
    for (let i = 0; i < priceElements.length; i++) {
      const price = priceElements[i].textContent;
      prices.push(price);
    }
    return prices;
  });

  await browser.close();

  return prices;
}
getFlightPrices('London','NewYork','2023-06-10')
  .then(prices => {
    console.log('Flight Prices:');
    prices.forEach(price => {
      console.log(price);
    });
  })
  .catch(error => {
    console.error('An error occurred:', error);
  });

//   source = 'New York';
//    destination = 'London';
//    date = '2023-06-10';
