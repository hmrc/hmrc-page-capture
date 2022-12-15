chrome.runtime.onMessage.addListener((request, sender, response) => {
  // @ts-ignore
  const documentId = sender.documentId;
  const pageUrl = sender.url;
  const page = request.payload;

  savePageUrl(pageUrl);
  getPageData(documentId, page, pageUrl);

  page.forEach((asset: string) => {
    const filename = JSON.parse(asset).filename;
    const url = JSON.parse(asset).url;

    downloadPage(documentId, filename, url);
  });
});

function savePageUrl(url: string) {
  chrome.storage.sync.get({urls: []}, function (result) {
    let urls = result.urls;

    urls.push(url);
    chrome.storage.sync.set({urls: urls}, function () {
      console.log(JSON.stringify(urls));
    });
  });
}

function getPageData(documentId: string, page: string[], url: string) {
  const content = btoa(JSON.stringify({documentId: documentId, url: url}));
  const payload = JSON.stringify({
    url: `data:application/json;base64,${content}`,
    filename: 'data.json',
  });

  page.push(payload);

  return page;
}

function downloadPage(documentId: string, filename: string, url: string) {
  chrome.downloads.download({
    url,
    filename: `${documentId}/${filename}`,
  });
}
