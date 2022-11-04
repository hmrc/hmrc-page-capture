document.addEventListener('DOMContentLoaded', function () {
    const manifestData = chrome.runtime.getManifest();
    document.querySelector('#version').innerText = manifestData.version;
    document.querySelector('#description').innerText = manifestData.description;
});

chrome.storage.sync.get({capturedUrls: []}, function (result) {
    const CapturedUrlsCount = document.getElementById('CapturedUrlsCount');
    CapturedUrlsCount.innerText = result.capturedUrls.length;
    const CapturedUrlsElement = document.getElementById('CapturedUrls');
    result.capturedUrls.forEach(url => CapturedUrlsElement.innerHTML += `<li>${url}</li>`);
});

chrome.storage.sync.get({excludedUrls: []}, function (result) {
    const ExcludedUrlsCount = document.getElementById('ExcludedUrlsCount');
    ExcludedUrlsCount.innerText = result.excludedUrls.length;
    const ExcludedUrlsElement = document.getElementById('ExcludedUrls');
    result.excludedUrls.forEach(url => ExcludedUrlsElement.innerHTML += `<li>${url}</li>`);
});

chrome.storage.sync.get({errorUrls: []}, function (result) {
    const ErrorUrlsCount = document.getElementById('ErrorUrlsCount');
    ErrorUrlsCount.innerText = result.errorUrls.length;
    const ErrorUrlsElement = document.getElementById('ErrorUrls');
    result.errorUrls.forEach(url => ErrorUrlsElement.innerHTML += `<li>${url}</li>`);
});
