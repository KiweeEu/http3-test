const args = process.argv;
const puppeteer = require('puppeteer');
const PuppeteerHar = require('puppeteer-har');
const params = [];

if (args.length > 2) {
  for (let i = 2; i < args.length; i++) {
    params.push(args[i]);
  }
}

let basicAuthUsername = '';

if ('BASIC_AUTH_USERNAME' in process.env) {
  basicAuthUsername = process.env.BASIC_AUTH_USERNAME;
}

let basicAuthPassword = '';

if ('BASIC_AUTH_PASSWORD' in process.env) {
  basicAuthPassword = process.env.BASIC_AUTH_PASSWORD;
}

let url = 'https://google.com';
if ('TEST_PAGE_URL' in process.env) {
  url = process.env.TEST_PAGE_URL;
}

(async () => {
  const browser = await puppeteer.launch({
    args: params,
  });

  const page = await browser.newPage();
  const har = new PuppeteerHar(page);
  await har.start({ path: 'output/network_' + Date.now() + '.har' });

  if (basicAuthUsername && basicAuthPassword) {
    await page.authenticate({ 'username': basicAuthUsername, 'password': basicAuthPassword });
  }

  await page.goto(url);
  await har.stop();
  await browser.close();
})();
