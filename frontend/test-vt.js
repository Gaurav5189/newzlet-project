import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // start the dev server first or proxy to the local running one? 
  // Wait, I can't easily start the dev server and test it in one short script if I don't know the port.
  // Let me just search react router documentation on the local filesystem or web for 'viewTransition'.
})();
