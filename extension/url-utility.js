function UrlUtility() {

    /**
     * Check if url ends is localhost.
     * @param {string} url The url to check.
     * @return {boolean} The result of whether the given url is localhost.
     */
    function isNotLocalhost(url) {
        let localhostRegEx = RegExp('http.*:\\/\\/localhost:.*');
        return !localhostRegEx.test(url)
    }

    /**
     * Check if url ends with -stub.
     * @param {string} url The url to check.
     * @return {boolean} The result of whether the given url is localhost and ends with -stub.
     */
    function isAStub(url) {
        let stubRegEx = RegExp('http.*:\/\/localhost:.*\/([a-z/-]+\-stub)');
        return stubRegEx.test(url)
    }

    /**
     * Check if url contains test-only.
     * @param {string} url The url to check.
     * @return {boolean} The result of whether the given url contains test-only.
     */
    function isTestOnly(url) {
        let testOnlyRegEx = RegExp('test\-only');
        return testOnlyRegEx.test(url)
    }

    /**
     * Check if url ends with secure-message-stub.
     * @param {string} url The url to check.
     * @return {boolean} The result of whether the given url is localhost and ends with secure-message-stub.
     */
    function isNotInAllowList(url) {
        let allowListRegex = RegExp('http.*:\/\/localhost:.*\/(secure-message-stub)');
        return !allowListRegex.test(url)
    }

    return {
        isNotLocalhost,
        isAStub,
        isTestOnly,
        isNotInAllowList
    }
}

export let urlUtility = new UrlUtility();