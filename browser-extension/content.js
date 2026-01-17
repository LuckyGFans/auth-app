// content.js
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === 'saveLogin') {
    const username = document.querySelector('input[type="email"], input[type="text"]').value;
    const password = document.querySelector('input[type="password"]').value;
    if (username && password) {
      const data = { username, password };
      const encrypted = await window.cryptoUtils.encryptData(data);
      chrome.storage.local.set({ [window.location.hostname]: encrypted });
      alert('Login saved (encrypted)');
    }
  } else if (request.action === 'fillLogin') {
    const stored = await chrome.storage.local.get(window.location.hostname);
    if (stored[window.location.hostname]) {
      try {
        const decrypted = await window.cryptoUtils.decryptData(stored[window.location.hostname]);
        document.querySelector('input[type="email"], input[type="text"]').value = decrypted.username;
        document.querySelector('input[type="password"]').value = decrypted.password;
      } catch (e) {
        alert('Failed to decrypt data. Check passphrase.');
      }
    }
  }
});