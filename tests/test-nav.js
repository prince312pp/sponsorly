const { chromium } = require('playwright');

(async () => {
    console.log('Launching browser...');
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        console.log('Navigating to https://example.com...');
        await page.goto('https://example.com', { timeout: 30000 });
        const title = await page.title();
        console.log('Successfully navigated to Example Domain');
        console.log('Title:', title);

        // Check if we can reach localhost (assuming server is running)
        console.log('Attempting to navigate to http://localhost:8080...');
        try {
            await page.goto('http://localhost:8080', { timeout: 10000 });
            console.log('Successfully navigated to localhost:8080');
        } catch (err) {
            console.log('Failed to navigate to localhost:8080. Is the server running?');
            console.log('Error:', err.message);
        }
    } catch (err) {
        console.error('Error during navigation:', err);
    } finally {
        await browser.close();
        console.log('Browser closed.');
    }
})();
