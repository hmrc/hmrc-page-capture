function saveUrlToStorage(url: string) {
  chrome.storage.sync.get({urls: []}, function (result) {
    var urls = result.urls;

    urls.push(url);
    chrome.storage.sync.set({urls: urls}, function () {
      console.log(JSON.stringify(urls));
    });
  });
}

function savePageToDownloads(documentId: String, tabId: number) {
  chrome.pageCapture.saveAsMHTML({tabId: tabId}, async (blob) => {
    const content = await blob.text();
    const url = 'data:application/x-mimearchive;base64,' + btoa(content);

    chrome.downloads.download({
      url,
      filename: `${documentId}/index.mhtml`,
    });
  });
}

chrome.runtime.onMessage.addListener((request, sender, response) => {
  // @ts-ignore
  const documentId = sender.documentId;
  const url = sender.url;
  const tabId = sender.tab.id;

  saveUrlToStorage(url);
  savePageToDownloads(documentId, tabId);
});
