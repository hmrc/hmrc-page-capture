import {urlUtility} from "./url-utility.js";

let pageUrl, capturedUrls, excludedUrls, errorUrls;

/**
 * Add pageUrl to chrome.storage capturedUrls.
 */
function storeCapturedUrl(tabId) {
    try {
        chrome.tabs.sendMessage(tabId, {message: "capture"});

        capturedUrls.push(pageUrl);
        chrome.storage.sync.set({capturedUrls: capturedUrls}, function () {
        });
    } catch {
        storeErrorUrl();
    }
}

/**
 * Add pageUrl to chrome.storage excludedUrls.
 */
function storeExcludedUrl() {
    excludedUrls.push(pageUrl);
    chrome.storage.sync.set({excludedUrls: excludedUrls}, function () {
    });
}

/**
 * Add pageUrl to chrome.storage errorUrls.
 */
function storeErrorUrl() {
    errorUrls.push(pageUrl);
    chrome.storage.sync.set({errorUrls: errorUrls}, function () {
    });
}

/**
 * Set chrome extension badge text to length of capturedUrls.
 */
function setExtensionBadgeText() {
    try {
        chrome.action.setBadgeText({text: capturedUrls.length.toString()}, () => {
        });
    } catch {
        // do nothing
    }
}

/**
 * Retrieve capturedUrls from chrome.storage.
 */
function retrieveCapturedUrls() {
    chrome.storage.sync.get({capturedUrls: []}, function (result) {
        capturedUrls = result.capturedUrls;
    });
}

/**
 * Retrieve excludedUrls from chrome.storage.
 */
function retrieveExcludedUrls() {
    chrome.storage.sync.get({excludedUrls: []}, function (result) {
        excludedUrls = result.excludedUrls;
    });
}

/**
 * Retrieve errorUrls from chrome.storage.
 */
function retrieveErrorUrls() {
    chrome.storage.sync.get({errorUrls: []}, function (result) {
        errorUrls = result.errorUrls;
    });
}

/**
 * Checks current page url to see whether it should
 * be captured or excluded based on rules within url-utility.js.
 * If the page url has already been captured then it is ignored.
 */
function checkUrl(tabId, tabs) {
    pageUrl = tabs[0].url;
    retrieveCapturedUrls();
    retrieveExcludedUrls();

    if (urlAlreadyCaptured(pageUrl)) return;
    if (urlAlreadyExcluded(pageUrl)) return;

    if (urlUtility.isNotLocalhost(pageUrl)) {
        storeExcludedUrl();
        return;
    }
    if (urlUtility.isAStub(pageUrl) && urlUtility.isNotInAllowList(pageUrl)) {
        storeExcludedUrl();
        return;
    }
    if (urlUtility.isTestOnly(pageUrl) && urlUtility.isNotInAllowList(pageUrl)) {
        storeExcludedUrl();
        return;
    }

    storeCapturedUrl(tabId);
}

/**
 * Check if url has already been captured.
 * @param {string} url The url to check.
 * @return {boolean} The result of whether the given url already exists within capturedUrls.
 */
function urlAlreadyCaptured(url) {
    return capturedUrls.includes(url)
}

/**
 * Check if url has already been excluded.
 * @param {string} url The url to check.
 * @return {boolean} The result of whether the given url already exists within excludedUrls.
 */
function urlAlreadyExcluded(url) {
    return excludedUrls.includes(url)
}

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    retrieveCapturedUrls();
    setExtensionBadgeText();
    retrieveExcludedUrls();
    retrieveErrorUrls();
    if (changeInfo.status === "complete" && tab.active) {
        chrome.tabs.query({active: true}, function (tabs) {
            checkUrl(tabId, tabs);
            retrieveCapturedUrls();
            setExtensionBadgeText();
        });
    }
});
