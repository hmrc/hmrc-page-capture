const puppeteer = require('puppeteer');
const path = require('path');
let browser, page;

const pathToExtension = require('path').join(
    path.join(__dirname, '..', 'extension')
);

const puppeteerArgs = [
    `--disable-extensions-except=${pathToExtension}`,
    `--load-extension=${pathToExtension}`,
    '--show-component-extension-options',
    '--disable-features=DialMediaRouteProvider', // disable popup asking "Do you want the application “Chromium.app” to accept incoming network connections?"
];

describe('Test extension', () => {
    const baseUrl = 'http://localhost:9080/check-your-vat-flat-rate/vat-return-period';
    let capturedUrlsCountElement = '#CapturedUrlsCount';
    let capturedUrlsElement = '#CapturedUrls';
    let excludedUrlsCountElement = '#ExcludedUrlsCount';
    let excludedUrlsElement = '#ExcludedUrls';
    const one = '1'

    beforeEach(async function () {
        browser = await puppeteer.launch({
            headless: false,
            slowMo: 200,
            args: puppeteerArgs
        });
        [page] = await browser.pages();
    });

    afterEach(() => browser.close());

    async function gotoExtensionPopupPage() {
        const targets = await browser.targets();
        const extensionTarget = targets.find(target => target.type() === 'service_worker');
        const partialExtensionUrl = extensionTarget.url() || '';
        const [, , extensionId] = partialExtensionUrl.split('/');

        const extensionUrl = `chrome-extension://${extensionId}/popup/popup.html`;

        await page.goto(extensionUrl, {waitUntil: ['domcontentloaded', "networkidle2"]});
    }

    it('Captures a unique `localhost` Url only once and displays it within the HTML popup', (async () => {
        await page._client().send("Page.setDownloadBehavior", {behavior: "allow", downloadPath: './target/downloads',});
        await page.goto(baseUrl, {waitUntil: ['domcontentloaded', "networkidle2"]});
        await page.goto(baseUrl, {waitUntil: ['domcontentloaded', "networkidle2"]});

        await gotoExtensionPopupPage();

        const capturedUrlCount = await page.$eval(capturedUrlsCountElement, (e => e.innerText));
        expect(capturedUrlCount).toEqual(one);

        const capturedUrls = await page.$eval(capturedUrlsElement, (e => e.innerHTML));
        expect(capturedUrls).toContain(baseUrl);
    }));

    it('Excludes a `test-only` Url and displays it within the HTML popup', (async () => {
        await page.goto(`${baseUrl}/test-only`, {waitUntil: ['domcontentloaded', "networkidle2"]});

        await gotoExtensionPopupPage();

        const excludedUrlCount = await page.$eval(excludedUrlsCountElement, (e => e.innerText));
        expect(excludedUrlCount).toEqual(one);

        const excludedUrls = await page.$eval(excludedUrlsElement, (e => e.innerHTML));
        expect(excludedUrls).toContain(`${baseUrl}/test-only`);
    }));

    it('Excludes a `-stub` Url and displays it within the HTML popup', (async () => {
        await page.goto(`${baseUrl}/service-stub`, {waitUntil: ['domcontentloaded', "networkidle2"]});

        await gotoExtensionPopupPage();

        const excludedUrlCount = await page.$eval(excludedUrlsCountElement, (e => e.innerText));
        expect(excludedUrlCount).toEqual(one);

        const excludedUrls = await page.$eval(excludedUrlsElement, (e => e.innerHTML));
        expect(excludedUrls).toContain(`${baseUrl}/service-stub`);
    }));

});