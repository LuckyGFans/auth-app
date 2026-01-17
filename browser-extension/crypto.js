// crypto.js - Encryption utilities using Web Crypto API

const SALT = new Uint8Array([0x12, 0x34, 0x56, 0x78, 0x9a, 0xbc, 0xde, 0xf0]); // Fixed salt for demo
const PASSPHRASE = 'masterpassword'; // Placeholder - replace with user input

async function deriveKey() {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(PASSPHRASE),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: SALT,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

async function encryptData(data) {
  const key = await deriveKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    new TextEncoder().encode(JSON.stringify(data))
  );

  return {
    encrypted: Array.from(new Uint8Array(encrypted)),
    iv: Array.from(iv)
  };
}

async function decryptData(encryptedData) {
  const key = await deriveKey();
  const iv = new Uint8Array(encryptedData.iv);
  const encrypted = new Uint8Array(encryptedData.encrypted);

  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    encrypted
  );

  return JSON.parse(new TextDecoder().decode(decrypted));
}

// Base32 decode function
function base32Decode(str) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let bits = '';
  for (let char of str.toUpperCase()) {
    if (char === '=') break;
    const index = alphabet.indexOf(char);
    if (index === -1) throw new Error('Invalid base32 character');
    bits += index.toString(2).padStart(5, '0');
  }
  const bytes = [];
  for (let i = 0; i < bits.length; i += 8) {
    bytes.push(parseInt(bits.substr(i, 8), 2));
  }
  return new Uint8Array(bytes);
}

// TOTP generate function
async function generateTOTP(secret) {
  const key = await crypto.subtle.importKey(
    'raw',
    base32Decode(secret),
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign']
  );
  const time = Math.floor(Date.now() / 1000 / 30);
  const timeBytes = new Uint8Array(8);
  for (let i = 7; i >= 0; i--) {
    timeBytes[i] = time & 0xff;
    time >>= 8;
  }
  const hmac = await crypto.subtle.sign('HMAC', key, timeBytes);
  const hmacBytes = new Uint8Array(hmac);
  const offset = hmacBytes[19] & 0xf;
  const code = ((hmacBytes[offset] & 0x7f) << 24) |
               ((hmacBytes[offset + 1] & 0xff) << 16) |
               ((hmacBytes[offset + 2] & 0xff) << 8) |
               (hmacBytes[offset + 3] & 0xff);
  return (code % 1000000).toString().padStart(6, '0');
}

window.cryptoUtils = { encryptData, decryptData, generateTOTP };