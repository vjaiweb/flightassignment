const puppeteer = require('puppeteer');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function getFlightPrices(source, destination, date) {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  await page.goto('https://www.google.com/travel/flights');

  await page.waitForSelector('Rk10dc', { visible: true, timeout: 5000 });

  // await page.waitForTimeout(1000);
  await page.type('.gws-flights-form__input-container:nth-child(1) input', source);
  // await page.waitForTimeout(1000);
  await page.type('.gws-flights-form__input-container:nth-child(2) input', destination);
  // await page.waitForTimeout(1000);
  await page.type('.flt-input-date-input input', date);

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

rl.question('Enter source: ', (source) => {
  rl.question('Enter destination: ', (destination) => {
    rl.question('Enter date (YYYY-MM-DD): ', (date) => {
      getFlightPrices(source, destination, date)
        .then(prices => {
          console.log('Flight Prices:');
          prices.forEach(price => {
            console.log(price);
          });
          rl.close();
        })
        .catch(error => {
          console.error('An error occurred:', error);
          rl.close();
        });
    });
  });
});
