window.onload = () => {
  let page = getPage();

  sendMessage(page);
};

function sendMessage(page: string[]) {
  chrome.runtime.sendMessage({
    payload: page,
  });
}

function getPage() {
  let page: string[] = [];
  const source = document.cloneNode(true) as Document;
  const selector = source.head.querySelectorAll('link[rel=stylesheet]');

  selector.forEach((stylesheet: HTMLLinkElement) => {
    const href = stylesheet.href;
    const filename = href.split('/').pop();
    const payload = JSON.stringify({url: href, filename: filename});

    page.push(payload);
    stylesheet.setAttribute('href', `./${filename}`);
  });

  const content = btoa(source.documentElement.outerHTML);
  const payload = JSON.stringify({
    url: `data:text/html;base64,${content}`,
    filename: 'index.html',
  });

  page.push(payload);

  return page;
}
