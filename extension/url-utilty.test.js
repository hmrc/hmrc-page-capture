import {urlUtility} from "./url-utility.js";

describe('url', () => {
    describe('isNotLocalhost', () => {
        it.each([
            [true, "http://site.co.uk"],
            [true, "https://site.co.uk/some-site"],
            [false, "http://localhost:1234/"],
            [false, "https://localhost:12345/some-page"]
        ])('should return %s when page URL is %s', async (expectedResult, pageUrl) => {
            expect(urlUtility.isNotLocalhost(pageUrl)).toBe(expectedResult);
        });
    });

    describe('isAStub', () => {
        it.each([
            [true, "http://localhost:1234/some-stub"],
            [true, "https://localhost:12345/some-stub"]
        ])('should return %s when page URL is %s', async (expectedResult, pageUrl) => {
            expect(urlUtility.isAStub(pageUrl)).toBe(expectedResult);
        });
    });

    describe('isTestOnly', () => {
        it.each([
            [true, "http://localhost:1234/test-only"],
            [true, "https://localhost:12345/test-only"],
            [true, "http://site.co.uk/test-only"],
            [true, "http://test-only"],
            [true, "https://test-only.co.uk"]
        ])('should return %s when page URL is %s', async (expectedResult, pageUrl) => {
            expect(urlUtility.isTestOnly(pageUrl)).toBe(expectedResult);
        });
    });

    describe('isNotInAllowList', () => {
        it.each([
            [true, "http://localhost:4000/secret-message-stub"],
            [true, "https://localhost:40001/secret-message-stub"],
            [false, "http://localhost:4000/secure-message-stub"],
            [false, "https://localhost:40001/secure-message-stub"]
        ])('should return %s when page URL is %s', async (expectedResult, pageUrl) => {
            expect(urlUtility.isNotInAllowList(pageUrl)).toBe(expectedResult);
        });
    });
});
