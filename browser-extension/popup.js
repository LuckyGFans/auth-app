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

document.getElementById('addSamples').addEventListener('click', async () => {
  const samples = [
    { hostname: 'github.com', username: 'testuser', password: 'testpass123', secret: 'JBSWY3DPEHPK3PXP' },
    { hostname: 'google.com', username: 'test@gmail.com', password: 'password456', secret: '' },
    { hostname: 'example.com', username: 'demo', password: 'demo123', secret: 'JBSWY3DPEHPK3PXP' }
  ];

  for (const sample of samples) {
    const data = { username: sample.username, password: sample.password, secret: sample.secret };
    const encrypted = await window.cryptoUtils.encryptData(data);
    chrome.storage.local.set({ [sample.hostname]: encrypted });
  }

  document.getElementById('status').textContent = 'Sample passwords added!';
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