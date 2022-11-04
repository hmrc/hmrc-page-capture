let timestamp;

chrome.runtime.onMessage.addListener(function (request) {
    if (request.message === 'capture') {
        timestamp = Date.now();
        savePageHtmlAndCssAssets();
    }
});

/**
 * Creates a file and forces it to be downloaded within the browser.
 * @param {string} data The data to be saved in the file.
 * @param {string} filename The name of the file.
 * @param {string} type The file type.
 */
function download(data, filename, type) {
    const file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob)
        // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else {
        // Others
        const a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}

/**
 * Creates a copy of the current document.
 * This is used to obtain stylesheets for a page.
 */
const shadow = document.documentElement.cloneNode(true);

/**
 * Save the current page and it's css assets as individual files.
 * Files are prefixed with a timestamp of when the page and it's css assets were captured
 */
function savePageHtmlAndCssAssets() {
    download(
        shadow.outerHTML,
        `${timestamp}/index.html`,
        "text/html"
    );

    styleSheets.forEach(savePageCssFiles);
}

/**
 * Obtains all stylesheets for the current page.
 */
const styleSheets = shadow.querySelectorAll("link[rel=stylesheet]");

/**
 * Saves each css page within the current page
 * @param {string} stylesheet The stylesheet to save.
 */
function savePageCssFiles(stylesheet) {
    const documentUrl = document.location.origin;
    const stylesheetHref = stylesheet.getAttribute("href");
    const stylesheetUrl = `${documentUrl}${stylesheetHref}`;

    getFromUrl(stylesheetUrl, stylesheetHref);
}

/**
 * Obtains contents of a file by specifying it's URL
 * @param {string} stylesheetUrl The URL to the file .
 * @param {string} filename The name to save the file as.
 */
function getFromUrl(stylesheetUrl, filename) {
    const xhr = new XMLHttpRequest()
    const handleStateChange = () => {
        if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 300) {
                download(
                    xhr.responseText,
                    `${timestamp}/${filename.replace('_', '/')}`,
                    "text/html"
                );
            }
        }
    }
    xhr.onreadystatechange = handleStateChange; // Implemented elsewhere.
    xhr.open("GET", stylesheetUrl, true)
    xhr.send()
}