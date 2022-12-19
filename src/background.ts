import messageSender = chrome.runtime.MessageSender;

chrome.runtime.onMessage.addListener(onPageLoaded);

function onPageLoaded(request: any, sender: messageSender) {
  const pageUrl = sender.url;
  const page = request.payload;
  const timestamp = Date.now();

  savePageUrl(pageUrl);
  getPageData(timestamp, page, pageUrl);

  page.forEach((asset: string) => {
    const filename = JSON.parse(asset).filename;
    const url = JSON.parse(asset).url;

    downloadPage(timestamp, filename, url);
  });
}

function savePageUrl(url: string) {
  chrome.storage.sync.get({urls: []}, function (result) {
    let urls = result.urls;

    urls.push(url);
    chrome.storage.sync.set({urls: urls}, function () {
      console.log(JSON.stringify(urls));
    });
  });
}

function getPageData(timestamp: number, page: string[], url: string) {
  const content = btoa(JSON.stringify({timestamp: timestamp, url: url}));
  const payload = JSON.stringify({
    url: `data:application/json;base64,${content}`,
    filename: 'data.json',
  });

  page.push(payload);

  return page;
}

function downloadPage(timestamp: number, filename: string, url: string) {
  chrome.downloads.download({
    url,
    filename: `hmrc-page-capture/${timestamp}/${filename}`,
  });
}
