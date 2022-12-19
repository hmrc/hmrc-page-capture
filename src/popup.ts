import './assets/scss/style.scss';

chrome.storage.sync.get({urls: []}, function (result) {
  const urlCount = document.getElementById('urlCount');
  urlCount.innerText = result.urls.length.toString();

  const urlList = document.getElementById('urlList');
  result.urls.forEach(
    (url: string) =>
      (urlList.innerHTML += `<li><a href="${url}" target="_blank">${url}</a></li>`)
  );
});
