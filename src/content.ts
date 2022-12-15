window.onload = () => {
  sendMessage();
};

function sendMessage() {
  chrome.runtime.sendMessage({payload: 'Capture URL and page source.'});
}
