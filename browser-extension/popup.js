// popup.js
document.getElementById('save').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const secret = document.getElementById('saveSecret').value;
    chrome.tabs.sendMessage(tabs[0].id, { action: 'saveLogin', secret });
  });
});

document.getElementById('fill').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'fillLogin' });
  });
});

document.getElementById('generate').addEventListener('click', async () => {
  const secret = document.getElementById('secret').value;
  if (secret) {
    try {
      const totp = await window.cryptoUtils.generateTOTP(secret);
      document.getElementById('totp').textContent = `TOTP: ${totp}`;
    } catch (e) {
      document.getElementById('totp').textContent = 'Invalid secret';
    }
  } else {
    document.getElementById('totp').textContent = 'Enter secret';
  }
});